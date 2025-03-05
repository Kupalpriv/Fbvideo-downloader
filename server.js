const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to fetch video data from the API
app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        // Fetch video data from the external API
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`);
        const videoData = response.data;

        // Ensure the API response contains the video URL
        if (videoData.videoUrl) {
            res.json(videoData);
        } else {
            res.status(500).json({ error: "Video URL not found in API response" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

// Proxy endpoint to force video download
app.get("/proxy", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        // Fetch the video file as a stream
        const response = await axios.get(videoUrl, { responseType: "stream" });

        // Set headers to force download
        res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        // Pipe the video stream to the response
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
