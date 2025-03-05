function downloadVideo() {
    let videoUrl = document.getElementById("fbUrl").value;

    if (!videoUrl) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    let apiUrl = `https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(videoUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                // Display video details in an alert
                alert(`📌 Title: ${data.title}\n🎥 Quality: ${data.quality}\n🖼 Thumbnail: ${data.thumbnail}`);

                // Automatically trigger the download
                let a = document.createElement("a");
                a.href = data.videoUrl;
                a.download = "facebook_video.mp4"; 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert("❌ Failed to fetch video. Please check the URL!");
            }
        })
        .catch(error => {
            console.error("Error fetching video:", error);
            alert("⚠️ An error occurred. Please try again later.");
        });
}
