document.addEventListener("DOMContentLoaded", () => {
    
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    document.getElementById("toggleDarkMode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });
});

function fetchVideo() {
    let fbUrl = document.getElementById("fbUrl").value;
    if (!fbUrl) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    document.getElementById("loading").classList.remove("d-none");
    document.getElementById("videoOptions").classList.add("d-none");

    fetch(`/download?url=${encodeURIComponent(fbUrl)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").classList.add("d-none");

            if (data.error) {
                alert("❌ Error fetching video. Please check the URL.");
                return;
            }

            let resolutionButtons = document.getElementById("resolutionButtons");
            resolutionButtons.innerHTML = "";
            data.resolutions.forEach(res => {
                let btn = document.createElement("button");
                btn.className = "btn btn-primary m-2";
                btn.innerText = `${res.quality}p`;
                btn.onclick = () => downloadVideo(res.url);
                resolutionButtons.appendChild(btn);
            });

            document.getElementById("videoOptions").classList.remove("d-none");
            document.getElementById("copyLinkBtn").onclick = () => copyLink(data.videoUrl);
        })
        .catch(() => {
            alert("⚠️ Unable to fetch video.");
            document.getElementById("loading").classList.add("d-none");
        });
}

function downloadVideo(url) {
    let link = document.createElement("a");
    link.href = url;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("📋 Link copied to clipboard!");
    }).catch(() => {
        alert("❌ Failed to copy link.");
    });
}
