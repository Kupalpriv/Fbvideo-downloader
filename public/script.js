document.addEventListener("DOMContentLoaded", () => {});

function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;
    let loadingOverlay = document.getElementById("loadingOverlay");

    if (!fbUrl) {
        Swal.fire({ icon: "warning", title: "⚠️ Invalid URL", text: "Please enter a valid Facebook video URL!", confirmButtonColor: "#007bff" });
        return;
    }

    let apiUrl = `/download?url=${encodeURIComponent(fbUrl)}`;
    loadingOverlay.classList.add("active");

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingOverlay.classList.remove("active");
            if (data.videoUrl) {
                window.location.href = `/proxy?url=${encodeURIComponent(data.videoUrl)}`;
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
