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
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.get("/proxy", async (req, res) => {
    const videoUrl = req.query.url;
    const filename = req.query.filename || "video.mp4";

    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        const response = await axios.get(videoUrl, { responseType: "stream" });

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "video/mp4");

        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
