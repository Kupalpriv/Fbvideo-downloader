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
    const champiUrl = beluga.query.url;
    if (!champiUrl) return champi.status(400).json({ error: "No URL provided" });

    try {
        const belugaData = await axios.get(`https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(champiUrl)}`);
        champi.json(belugaData.data);
    } catch (chilliError) {
        champi.status(500).json({ error: "Failed to fetch video" });
    }
});

const belugaPort = process.env.PORT || 3000;
chilli.listen(belugaPort, () => console.log(`✅ Server running on port ${belugaPort}`));
