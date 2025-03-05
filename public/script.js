function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;

    if (!fbUrl) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    let apiUrl = `/download?url=${encodeURIComponent(fbUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                let confirmation = confirm(`📌 Title: ${data.title}\n🎥 Quality: ${data.quality}\n🖼 Thumbnail: ${data.thumbnail}\n\nClick "OK" to download.`);

                if (confirmation) {
                    // Create a temporary anchor element to trigger the download
                    let a = document.createElement("a");
                    a.href = data.videoUrl;
                    a.download = `${data.title || "facebook_video"}.mp4`;  
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            } else {
                alert("❌ Failed to fetch video. Please check the URL!");
            }
        })
        .catch(error => {
            console.error("Error fetching video:", error);
            alert("⚠️ An error occurred. Please try again later.");
        });
}
