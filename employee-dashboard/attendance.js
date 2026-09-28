document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedTab = item.getAttribute("data-tab");

      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === selectedTab) {
          section.classList.add("active");
        }
      });
    });
  });

  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Settings updated successfully!");
    });
  }
});
