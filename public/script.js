function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value.trim();

    // Basic validation to check if the input is a URL
    if (!isValidUrl(fbUrl)) {
        Swal.fire({
            icon: "warning",
            title: "⚠️ Invalid URL",
            text: "Please enter a valid Facebook video URL!",
            confirmButtonColor: "#007bff",
        });
        return;
    }

    showLoading();

    fetch(`/download?url=${encodeURIComponent(fbUrl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch video");
            }
            return response.json();
        })
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
            } else {
                throw new Error("Invalid video URL or video not found");
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message || "Something went wrong! Please check the link and try again.",
                confirmButtonColor: "#007bff",
            });
        })
        .finally(() => {
            hideLoading();
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

// Function to check if the input is a valid URL
function isValidUrl(url) {
    try {
        new URL(url); // This will throw an error if the URL is invalid
        return true;
    } catch (error) {
        return false;
    }
}
