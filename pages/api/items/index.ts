import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Item from "@/app/models/Item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await dbConnect();

    switch(method) {
        case "GET":
            try {
                const items = await Item.find({}).select('-_id -__v');
                res.status(200).json({ data: items });
            } catch (error) {
                res.status(400).json({ error: error});
            }
            break;
        case "POST":
            try {
                const item = await Item.create((req.body));
                res.status(201).json({ data: item });
            } catch (error) {
                res.status(400).json({ error: error});
            }
            break;
        default:
            res.status(400).json({ error: 'Method not found.'});
    }
}