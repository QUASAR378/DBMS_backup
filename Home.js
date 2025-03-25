document.addEventListener("DOMContentLoaded", function() {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();
  
  // Authentication Modal Logic
  const authIcon = document.getElementById("authIcon");
  const authModal = document.getElementById("authModal");
  const closeModal = document.querySelector(".close-btn");
  
  authIcon.addEventListener("click", () => {
    authModal.style.display = "block";
  });
  
  closeModal.addEventListener("click", () => {
    authModal.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === authModal) {
      authModal.style.display = "none";
    }
  });
});