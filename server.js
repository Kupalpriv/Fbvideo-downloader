const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const chilli = express();
chilli.use(cors());
chilli.use(express.static("public"));

chilli.get("/", (beluga, champi) => {
    champi.sendFile(path.join(__dirname, "public", "index.html"));
});

chilli.get("/download", async (beluga, champi) => {
    const videoUrl = beluga.query.url;
    if (!videoUrl) return champi.status(400).json({ error: "No URL provided" });

    try {
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`);
        const videoDirectUrl = response.data.videoUrl;

        if (!videoDirectUrl) return champi.status(404).json({ error: "Video not found" });

        champi.redirect(`/proxy?video=${encodeURIComponent(videoDirectUrl)}`);
    } catch (error) {
        champi.status(500).json({ error: "Failed to fetch video" });
    }
});

chilli.get("/proxy", async (beluga, champi) => {
    const video = beluga.query.video;
    if (!video) return champi.status(400).json({ error: "No video URL" });

    try {
        const response = await axios.get(video, { responseType: "stream" });
        champi.setHeader("Content-Disposition", 'attachment; filename="facebook_video.mp4"');
        response.data.pipe(champi);
    } catch (error) {
        champi.status(500).json({ error: "Error downloading video" });
    }
});

const belugaPort = process.env.PORT || 3000;
chilli.listen(belugaPort, () => console.log(`✅ Server running on port ${belugaPort}`));
