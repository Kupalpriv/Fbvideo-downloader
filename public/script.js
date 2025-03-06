document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script Loaded!");
});

function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;

    if (!fbUrl) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    let apiUrl = `/download?url=${encodeURIComponent(fbUrl)}`;

    console.log("🔍 Sending request to:", apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Response:", data);

            if (data.videoUrl) {
                let confirmation = confirm(`📌 Title: ${data.title}\n🎥 Quality: ${data.quality}\n\nClick "OK" to download.`);
                if (confirmation) {
                    // Gamit ang /proxy para i-force download ang video
                    let downloadLink = document.createElement("a");
                    downloadLink.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}`;
                    downloadLink.download = "video.mp4";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            } else {
                alert("❌ Failed to fetch video. Please check the URL!");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching video:", error);
            alert("⚠️ An error occurred. Please try again later.");
        });
}

function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("fbUrl").value = text;
    }).catch(err => {
        console.error("❌ Failed to paste:", err);
    });
}
