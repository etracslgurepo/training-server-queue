// pages/api/data/getData.ts

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const dataPath = path.join(process.cwd(), "public", "_custom", "data.json");
    const templatePath = path.join(process.cwd(), "src", "pages", "api", "data", "template.json");

    let text = "";
    if (fs.existsSync(dataPath)) {
      text = (fs.readFileSync(dataPath, "utf-8") ?? "").trim();
    }

    if (text.startsWith("{") && text.endsWith("}")) {
      const parsedData = JSON.parse(text);
      res.status(200).json(parsedData);
    } else if (fs.existsSync(templatePath)) {
      const tplText = (fs.readFileSync(templatePath, "utf-8") ?? "").trim();
      if (tplText.startsWith("{") && tplText.endsWith("}")) {
        const parsedTemplate = JSON.parse(tplText);
        res.status(200).json(parsedTemplate);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
