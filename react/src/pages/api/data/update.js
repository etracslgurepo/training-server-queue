// ✅ File: /api/data/update.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { groups: incomingGroup } = req.body;

    if (!incomingGroup || !incomingGroup.id) {
      return res.status(400).json({ error: "Missing group id." });
    }

    const filePath = path.join(process.cwd(), "public", "_custom", "data.json");
    const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

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
          if (key !== "id" && 
              incomingGroup[key] != null && 
              incomingGroup[key] !== "" &&
              !isEqual(incomingGroup[key], existingData.defaultTheme[key])) {
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
        const cleanedGroup = removeDefaultProperties(mergedGroup, existingData.defaultTheme);
        
        // If the cleaned group only has an id, remove it entirely
        if (Object.keys(cleanedGroup).length === 1) {
          existingData.groups.splice(idx, 1);
          console.log(`Group with ID "${incomingGroup.id}" removed as it matches defaultTheme`);
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
      .map(group => removeDefaultProperties(group, existingData.defaultTheme))
      .filter(group => Object.keys(group).length > 1); // Remove groups with only id

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    return res.status(200).json({ message: "Group changes applied." });
  } catch (error) {
    console.error("Error updating group:", error);
    return res.status(500).json({ error: "Failed to update group" });
  }
}