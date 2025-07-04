// pages/api/data.js
import fs from "fs";

export default function handler(req, res) {
    try {
        const data = fs.readFileSync("./data.json", "utf-8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}