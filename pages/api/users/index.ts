import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await dbConnect();

    switch(method) {
        case "GET":
            try {
                const users = await User.find({}).select('-_id -__v');
                res.status(200).json({ data: users });
            } catch (error) {
                res.status(400).json({ error: error});
            }
            break;
        case "POST":
            try {
                const user = await User.create((req.body));
                res.status(201).json({ data: user });
            } catch (error) {
                res.status(400).json({ error: error});
            }
            break;
        default:
            res.status(400).json({ error: 'Method not found.'});
    }
}