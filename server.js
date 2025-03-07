const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.static("public"));

let userCount = 0; // Track total downloads
const logFilePath = path.join(__dirname, "download_logs.txt"); // Log file path

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    // Increment user count and log the download request
    userCount++;
    const logEntry = `Download request: ${videoUrl} at ${new Date().toISOString()}\n`;
    fs.appendFileSync(logFilePath, logEntry);

    try {
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.get("/proxy", async (req, res) => {
    const videoUrl = req.query.url;
    const videoTitle = req.query.title || "video";

    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        const response = await axios.get(videoUrl, { responseType: "stream" });

        const sanitizedTitle = videoTitle.replace(/[^a-zA-Z0-9]/g, "_");
        res.setHeader("Content-Disposition", `attachment; filename="${sanitizedTitle}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

// Endpoint to get user count
app.get("/stats", (req, res) => {
    res.json({ userCount });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
