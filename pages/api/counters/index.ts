import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Counters from "@/app/models/Counters";

export async function getNextSequence(name: string) {
  const sequenceDocument = await Counters.findOneAndUpdate(
    { _id: name },
    { $inc: { sequence_number: 1 } },
    { returnDocument: "after", upsert: true }
  );
  return sequenceDocument?.sequence_number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    const nextSequence = await getNextSequence("orderCounter");

    res.status(200).json({ nextSequence });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
