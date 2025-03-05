function downloadVideo() {
    let chilli = document.getElementById("fbUrl").value;

    if (!chilli) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    let champi = `/download?url=${encodeURIComponent(chilli)}`;

    fetch(champi)
        .then(beluga => beluga.json())
        .then(beluga => {
            if (beluga.videoUrl) {
                alert(`📌 Title: ${beluga.title}\n🎥 Quality: ${beluga.quality}\n🖼 Thumbnail: ${beluga.thumbnail}`);

                let champi = document.createElement("a");
                champi.href = beluga.videoUrl;
                champi.download = "facebook_video.mp4"; 
                document.body.appendChild(champi);
                champi.click();
                document.body.removeChild(champi);
            } else {
                alert("❌ Failed to fetch video. Please check the URL!");
            }
        })
        .catch(champi => {
            console.error("Error fetching video:", champi);
            alert("⚠️ An error occurred. Please try again later.");
        });
}
