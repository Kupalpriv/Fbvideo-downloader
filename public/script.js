function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;
    if (!fbUrl) return Swal.fire({ icon: "warning", title: "⚠️ Invalid URL", text: "Please enter a valid Facebook video URL!", confirmButtonColor: "#007bff" });

    showLoading();

    fetch(`/download?url=${encodeURIComponent(fbUrl)}`)
        .then(response => response.json())
        .then(data => {
            if (data.videoUrl) {
                document.getElementById("video-thumbnail").src = data.thumbnail;
                document.getElementById("video-thumbnail").style.display = "block";

                let videoTitle = data.title.replace(/[^a-zA-Z0-9]/g, "_");
                let downloadLink = document.createElement("a");
                downloadLink.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}&title=${videoTitle}`;
                downloadLink.download = `${videoTitle}.mp4`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        })
        .catch(error => {
            Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong!", confirmButtonColor: "#007bff" });
        })
        .finally(() => {
            hideLoading();
            updateUserCount();
        });
}

function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("fbUrl").value = text;
    });
}

function showLoading() {
    document.getElementById("loading-overlay").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loading-overlay").style.display = "none";
}

function updateUserCount() {
    fetch("/stats")
        .then(response => response.json())
        .then(data => {
            document.getElementById("user-count").innerText = `Total Downloads: ${data.userCount}`;
        });
}

document.addEventListener("DOMContentLoaded", updateUserCount);
