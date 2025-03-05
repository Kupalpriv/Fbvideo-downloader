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
                    window.location.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}`;
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

function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("fbUrl").value = text;
    }).catch(err => {
        console.error("Failed to paste:", err);
    });
}
