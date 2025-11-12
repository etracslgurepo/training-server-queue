// ✅ File: /api/data/update.js

import fs from "fs";
import path from "path";

const basicTheme = {
   "id": "default",
    "color": "#335F96",
    "showReserveTicket": false,
    "showVideo": true,
    "videoUrl": ["/videos/sample.mp4"],
    "videoposition": "main-left",
    "videoLayout": "standard",
    "windowposition": "main-right",
    "xyAxis": "vertical",
    "rowCount": "3",
    "columnCount": "1",
    "bgUrl": "",
    "bgSize": "auto",
    "windowCount": "3"
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { groups: incomingGroup } = req.body;

    if (!incomingGroup || !incomingGroup.id) {
      return res.status(400).json({ error: "Missing group id." });
    }

    const dirPath = path.join(process.cwd(), "public", "_custom");
    const dataPath = path.join(dirPath, "data.json");
    const templatePath = path.join(process.cwd(), "src", "pages", "api", "data", "template.json");

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let existingData = {};
    if (fs.existsSync(dataPath)) {
      let text = fs.readFileSync(dataPath, "utf-8");
      text = text.trim();
      if (text.startsWith("{") && text.endsWith("}")) {
        existingData = JSON.parse(text);
      }
    } else if (fs.existsSync(templatePath)) {
      const tplText = (fs.readFileSync(templatePath, "utf-8") ?? "").trim();
      if (tplText.startsWith("{") && tplText.endsWith("}")) {
        existingData = JSON.parse(tplText);
        // Create data.json on first update with template contents
        fs.writeFileSync(dataPath, JSON.stringify(existingData));
      }
    }

    const isEqual = (a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };

    // Function to remove properties that match defaultTheme
    const removeDefaultProperties = (group, defaultTheme) => {
      const cleanedGroup = { id: group.id }; // Always keep the id

      Object.keys(group).forEach((key) => {
        if (key !== "id") {
          // Only keep the property if it's different from defaultTheme
          if (!isEqual(group[key], defaultTheme[key])) {
            cleanedGroup[key] = group[key];
          }
        }
      });

      return cleanedGroup;
    };

    if (existingData.groups == null) existingData.groups = [];
    if (existingData.defaultTheme == null) existingData.defaultTheme = basicTheme;
    if (Object.keys(existingData.defaultTheme).length === 0 ) existingData.defaultTheme = basicTheme;

    // Special case: if group id is 'gen', remove it
    if (incomingGroup.id === "gen") {
      existingData.groups = existingData.groups.filter((g) => g.id !== "gen");
      console.log(`Group with ID "gen" has been removed.`);
    } else {
      const idx = existingData.groups.findIndex(
        (g) => g.id === incomingGroup.id
      );

      if (idx === -1) {
        // For new groups, filter out empty values and default matches
        const filtered = {};
        Object.keys(incomingGroup).forEach((key) => {
          if (
            key !== "id" &&
            incomingGroup[key] != null &&
            incomingGroup[key] !== "" &&
            !isEqual(incomingGroup[key], existingData.defaultTheme[key])
          ) {
            filtered[key] = incomingGroup[key];
          }
        });

        if (Object.keys(filtered).length > 0) {
          existingData.groups.push({ id: incomingGroup.id, ...filtered });
        }
      } else {
        const currentGroup = existingData.groups[idx];

        // Merge current group with incoming changes
        const mergedGroup = { ...currentGroup };
        let changed = false;

        for (const key in incomingGroup) {
          if (key !== "id" && !isEqual(incomingGroup[key], currentGroup[key])) {
            mergedGroup[key] = incomingGroup[key];
            changed = true;
          }
        }

        // Always clean up the group to remove properties matching defaultTheme
        const cleanedGroup = removeDefaultProperties(
          mergedGroup,
          existingData.defaultTheme
        );

        // If the cleaned group only has an id, remove it entirely
        if (Object.keys(cleanedGroup).length === 1) {
          existingData.groups.splice(idx, 1);
          console.log(
            `Group with ID "${incomingGroup.id}" removed as it matches defaultTheme`
          );
        } else {
          existingData.groups[idx] = cleanedGroup;
        }

        console.log("groups", changed);
      }
    }

    // Update general settings if provided
    if (req.body.general) {
      existingData.general = {
        ...existingData.general,
        ...req.body.general,
      };
    }

    // Clean up all existing groups to remove default matches
    existingData.groups = existingData.groups
      .map((group) => removeDefaultProperties(group, existingData.defaultTheme))
      .filter((group) => Object.keys(group).length > 1); // Remove groups with only id

    console.log("existingData ===>", existingData)
    fs.writeFileSync(dataPath, JSON.stringify(existingData));
    return res.status(200).json({ message: "Group changes applied." });
  } catch (error) {
    console.error("Error updating group:", error);
    return res.status(500).json({ error: "Failed to update group" });
  }
}
