// pages/api/data/update.ts

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { group, general } = req.body;

    if (!group || !group.id) {
      return res.status(400).json({ error: "Missing group data or id." });
    }

    const filePath = path.join(process.cwd(), "public", "_custom", "data.json");

    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Update group data
    const updatedGroupList = existingData.group.map((g) =>
      g.id === group.id ? { ...g, ...group } : g
    );

    existingData.group = updatedGroupList;

    // Update general data (logo, font, etc.)
    if (general) {
      existingData.general = {
        ...existingData.general,
        ...general,
      };
    }

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: "Data updated successfully!" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Failed to update data" });
  }
}
