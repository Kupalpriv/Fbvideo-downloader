function fetchThumbnail() {
    let fbUrl = document.getElementById("fbUrl").value;
    if (!fbUrl) return;

    fetch(`/fetch-meta?url=${encodeURIComponent(fbUrl)}`)
        .then(response => response.json())
        .then(data => {
            if (data.thumbnail) {
                document.getElementById("video-thumbnail").src = data.thumbnail;
                document.getElementById("video-thumbnail").style.display = "block";
            }
        });
}

function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;
    if (!fbUrl) return alert("⚠️ Please enter a valid Facebook video URL!");

    fetch(`/fetch-meta?url=${encodeURIComponent(fbUrl)}`)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                let videoTitle = data.title.replace(/[^a-zA-Z0-9]/g, "_");
                let downloadLink = document.createElement("a");
                downloadLink.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}&title=${videoTitle}`;
                downloadLink.download = `${videoTitle}.mp4`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        });
}

function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("fbUrl").value = text;
        fetchThumbnail();
    });
}
