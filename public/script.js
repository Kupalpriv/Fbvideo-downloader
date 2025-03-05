function downloadVideo() {
    let fbUrl = document.getElementById("fbUrl").value;

    if (!fbUrl) {
        alert("⚠️ Please enter a valid Facebook video URL!");
        return;
    }

    let apiUrl = `/download?url=${encodeURIComponent(fbUrl)}`;

    fetch(apiUrl)
        .then(response => response.text())  
        .then(data => {
            if (data.includes("/proxy?video=")) {
                let confirmation = confirm("🎥 Video found! Click OK to download.");
                
                if (confirmation) {
                    window.location.href = data.trim(); 
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
