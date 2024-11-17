import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Item from "@/app/models/Item";
import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";
import fs from "fs/promises";

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
        const items = await Item.find({}).select("-__v");

        const itemsWithImages = items.map(item => {
          return {
            ...item.toObject(),
            image: item.image ? item.image.toString("base64") : null,
          };
        });

        res.status(200).json({ data: itemsWithImages });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
  
    case "POST":
      if(!session) {
        return res.status(401).json({ error: "Unauthorized request"});
      }

      if (parseInt(session.privilegeLevel) < 3) {
        return res.status(403).json({ error: "Insufficient privilege level" });
      }

      if(!session) {
        return res.status(401).json({ error: "Unauthorized request"});
      }
      try {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
          if (err) return res.status(500).json({ error: "Failed to parse form data" });
          
          const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
          const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
          const price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price || '0');

          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

          if(!imageFile) return res.status(400).json({ error: "Image file is required" });

          const imageBuffer = await fs.readFile(imageFile.filepath);
          console.log('imageBuffer:', imageBuffer)

          const newItem = await Item.create({
            name,
            category,
            price,
            image: imageBuffer,
            imageType: imageFile.mimetype,
          });

          res.status(201).json({ data: newItem });
        })
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
  
    case "PUT":
      if(!req.body.session) {
        return res.status(401).json({ error: "Unauthorized request"});
    }
      if (parseInt(req.body.session?.privilegeLevel) < 3) {
        return res.status(403).json({ error: "Insufficient privilege level" });
      }
      try {
        const { id } = req.query;
        const updatedItem = await Item.findByIdAndUpdate(id, req.body.item, {
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
      if(!session) {
        return res.status(401).json({ error: "Unauthorized request"});
    }
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