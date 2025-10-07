// pages/api/data/getData.ts

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "public", "_custom", "data.json");
    let text = "";
    if (fs.existsSync(filePath)) {
      text = fs.readFileSync(filePath, "utf-8") ?? "";
      text = text.trim();
    }

    if (text.startsWith("{") && text.endsWith("}")) {
      const parsedData = JSON.parse(text);
      console.log("parsedData ===>", parsedData)
      res.status(200).json(parsedData);
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
