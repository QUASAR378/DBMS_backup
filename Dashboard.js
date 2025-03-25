// Function to navigate to different pages
function navigateTo(page) {
    window.location.href = page;
}

// Set current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();