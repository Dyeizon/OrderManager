import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await dbConnect();
	const { method } = req;
	const session = await getSession({ req });
	
	switch (method) {
		case "GET":
		if(!session) {
			return res.status(401).json({ error: "Unauthorized request"});
		}
		try {
			const orders = await Order.find({}).select("-__v");
			
			res.status(200).json({ data: orders });
		} catch (error) {
			res.status(400).json({ error: error });
		}
		break;
		
		case "POST":
		// if(!s) {
		// 	return res.status(401).json({ error: "Unauthorized request"});
		// }
		
		// if (parseInt(s.privilegeLevel) < 3) {
		// 	return res.status(403).json({ error: "Insufficient privilege level" });
		// }
		
		try {
			const form = new IncomingForm();

			form.parse(req, async (err, fields) => {
				if (err) return res.status(500).json({ error: "Failed to parse form data" });
				
				const code = Array.isArray(fields.code) ? parseFloat(fields.code[0]) : parseFloat(fields.code || '0');
				const status = Array.isArray(fields.status) ? parseFloat(fields.status[0]) : parseFloat(fields.status || '0');
				const total = Array.isArray(fields.total) ? parseFloat(fields.total[0]) : parseFloat(fields.total || '0');
				const cart = Array.isArray(fields.cart) ? fields.cart[0] : fields.cart;
				
				console.log(fields);
				console.log(code)
				console.log(status)
				console.log(total)
				console.log(cart)

				const newOrder = await Order.create({
					code,
					status,
					total,
					cart,
				});

				res.status(201).json({ data: newOrder });
			})
		} catch (error) {
			res.status(400).json({ error: error});
		}
		break;
		
		case "PUT":
		if(!session) {
			return res.status(401).json({ error: "Unauthorized request"});
		}
		if (parseInt(session.privilegeLevel) < 3) {
			return res.status(403).json({ error: "Insufficient privilege level" });
		}
		
		try {
			const { id } = req.query;
			const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!updatedOrder) {
				return res.status(404).json({ error: "Order not found" });
			}
			res.status(200).json({ data: updatedOrder });
		} catch (error) {
			res.status(400).json({ error: error });
		}
		break;
		
		case "DELETE":
		if(!session) {
			return res.status(401).json({ error: "Unauthorized request"});
		}
		if (parseInt(session?.privilegeLevel) < 3) {
			return res.status(403).json({ error: "Insufficient privilege level" });
		}
		try {
			const { id } = req.query;
			const deletedOrder = await Order.findByIdAndDelete(id);
			if (!deletedOrder) {
				return res.status(404).json({ error: "Order not found" });
			}
			res.status(200).json({ message: "Order deleted successfully", data: deletedOrder });
		} catch (error) {
			res.status(400).json({ error: error });
		}
		break;
		
		default:
		res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
		res.status(405).json({ error: `Method ${method} not allowed` });
		break;
	}
}