document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");

  // Tab Switching Handler
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedTab = item.getAttribute("data-tab");

      // Active state update in sidebar
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // Display corresponding section
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === selectedTab) {
          section.classList.add("active");
        }
      });
    });
  });

  // Settings Form Submit Handler
  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Settings updated successfully!");
    });
  }
});
