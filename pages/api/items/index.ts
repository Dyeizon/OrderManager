import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Item from "@/app/models/Item";
import { getSession } from "next-auth/react";
import jwt from "next-auth/jwt"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
    const secret = process.env.NEXTAUTH_SECRET
    const { method } = req;
    const session = await getSession({ req });
    const token = await jwt?.getToken({ req, secret })
    if(token) {
      console.log('-----------TOKEN------------:',token.name)
    }

    console.log("Session in API:", session);
    console.log(req.cookies['next-auth.session-token'])


    // if(!session) {
    //     return res.status(401).json({ error: "Unauthorized request"});
    // }

    switch (method) {
        case "GET":
          try {
            const items = await Item.find({}).select("-__v");
            res.status(200).json({ data: items });
          } catch (error) {
            res.status(400).json({ error: error });
          }
          break;
      
        case "POST":
          if (parseInt(session?.privilegeLevel) < 3) {
            return res.status(403).json({ error: "Insufficient privilege level" });
          }
          try {
            const item = await Item.create(req.body);
            res.status(201).json({ data: item });
          } catch (error) {
            res.status(400).json({ error: error });
          }
          break;
      
        case "PUT":
          if (parseInt(session?.privilegeLevel) < 3) {
            return res.status(403).json({ error: "Insufficient privilege level" });
          }
          try {
            const { id } = req.query;
            const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
              new: true,
              runValidators: true,
            });
            if (!updatedItem) {
              return res.status(404).json({ error: "Item not found" });
            }
            res.status(200).json({ data: updatedItem });
          } catch (error) {
            res.status(400).json({ error: error });
          }
          break;
      
        case "DELETE":
          if (parseInt(session?.privilegeLevel) < 3) {
            return res.status(403).json({ error: "Insufficient privilege level" });
          }
          try {
            const { id } = req.query;
            const deletedItem = await Item.findByIdAndDelete(id);
            if (!deletedItem) {
              return res.status(404).json({ error: "Item not found" });
            }
            res.status(200).json({ message: "Item deleted successfully", data: deletedItem });
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