import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await dbConnect();
    const session = await getSession({ req });

    if(!session) {
        return res.status(401).json({ error: "Unauthorized request"});
    }
    if (parseInt(session.privilegeLevel) < 3) {
        return res.status(403).json({ error: "Insufficient privilege level" });
    }
    
    switch(method) {
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