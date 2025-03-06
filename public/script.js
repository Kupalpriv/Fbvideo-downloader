document.addEventListener("DOMContentLoaded", () => {});

function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;

    if (!fbUrl) {
        Swal.fire({ icon: "warning", title: "⚠️ Invalid URL", text: "Please enter a valid Facebook video URL!", confirmButtonColor: "#007bff" });
        return;
    }

    let apiUrl = `/download?url=${encodeURIComponent(fbUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                let videoTitle = data.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
                let downloadLink = document.createElement("a");
                downloadLink.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}&filename=${videoTitle}.mp4`;
                downloadLink.download = `${videoTitle}.mp4`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                Swal.fire({ icon: "error", title: "❌ Download Failed", text: "Video not found!", confirmButtonColor: "#007bff" });
            }
        });
}

function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("fbUrl").value = text;
    });
}
