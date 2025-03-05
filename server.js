const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        console.log("🔍 Fetching from API:", videoUrl);
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`);
        console.log("✅ API Response:", response.data);

        const videoData = response.data;
        if (videoData.videoUrl) {
            res.json(videoData);
        } else {
            console.error("❌ Error: No videoUrl in API response");
            res.status(500).json({ error: "Video URL not found in API response" });
        }
    } catch (error) {
        console.error("❌ Error fetching video:", error.message);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.get("/proxy", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        console.log("📡 Proxying video for download:", videoUrl);
        const response = await axios.get(videoUrl, { responseType: "stream" });

        res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
        res.setHeader("Content-Type", "video/mp4");

        response.data.pipe(res);
    } catch (error) {
        console.error("❌ Error proxying video:", error.message);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
