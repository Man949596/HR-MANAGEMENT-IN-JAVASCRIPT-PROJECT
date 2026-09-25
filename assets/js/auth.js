
document.addEventListener("DOMContentLoaded", function () {

    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
        signinForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("signin-email").value;
            const role = document.getElementById("signin-role").value;

            localStorage.setItem("userRole", role);
            localStorage.setItem("userEmail", email);

            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "../employee-dashboard/index.html";
            }
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const role = document.getElementById("signup-role").value;

            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", role);

            alert("Account created successfully! Redirecting to dashboard...");

            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "../employee-dashboard/index.html";
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            window.location.href = "../signin.html";
        });
    }

    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) {
        const welcomeUser = document.getElementById("welcome-user-name");
        const dashUser = document.getElementById("dash-user-name");
        const headerUser = document.getElementById("header-user-name");

        if (welcomeUser) welcomeUser.textContent = storedName;
        if (dashUser) dashUser.textContent = storedName;
        if (headerUser) headerUser.textContent = storedName;
    } else if (storedEmail) {
        const emailName = storedEmail.split('@')[0];
        const dashUser = document.getElementById("dash-user-name");
        const headerUser = document.getElementById("header-user-name");

        if (dashUser) dashUser.textContent = emailName;
        if (headerUser) headerUser.textContent = emailName;
    }

    const sidebar = document.getElementById("dashboard-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const toggleBtn = document.getElementById("mobile-sidebar-toggle");
    const closeBtn = document.getElementById("close-sidebar-btn");

    function openSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.add("open");
            overlay.classList.remove("hidden");
        }
    }

    function closeSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.remove("open");
            overlay.classList.add("hidden");
        }
    }

    if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
});