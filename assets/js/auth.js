document.addEventListener("DOMContentLoaded", function () {
    function showAlert(message, type = "error") {
        const alertBox = document.getElementById("auth-alert");
        if (alertBox) {
            alertBox.style.display = "block";
            alertBox.textContent = message;
            if (type === "success") {
                alertBox.style.backgroundColor = "#d4edda";
                alertBox.style.color = "#155724";
                alertBox.style.border = "1px solid #c3e6cb";
            } else {
                alertBox.style.backgroundColor = "#f8d7da";
                alertBox.style.color = "#721c24";
                alertBox.style.border = "1px solid #f5c6cb";
            }
        } else {
            alert(message);
        }
    }

    function addAuthNotification(systemDb, action, name, email, role) {
        systemDb.notifications = Array.isArray(systemDb.notifications) ? systemDb.notifications : [];
        systemDb.notifications.unshift({
            id: `auth-${action}-${Date.now()}`,
            title: action === "signup" ? "New account signup" : "Login activity",
            message: `${name} (${email}) ${action === "signup" ? "signed up" : "logged in"} as ${role}.`,
            target: "admin",
            createdAt: new Date().toISOString(),
            readBy: [],
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("signup-name").value.trim();
            const email = document
                .getElementById("signup-email")
                .value.trim()
                .toLowerCase();
            const role = document.getElementById("signup-role").value;
            const password = document.getElementById("signup-password").value;

            let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
            const systemDb = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB")) || {
                users: [],
                attendance: [],
                leaves: [],
                notifications: [],
                auditLogs: [],
            };
            if ((systemDb.deletedUserEmails || []).includes(email)) {
                showAlert("This account was deleted by an administrator and cannot be registered again.", "error");
                return;
            }

            const userExists = users.some((user) => user.email === email);
            if (userExists) {
                showAlert("This email is already registered! Please sign in.", "error");
                return;
            }
            const newUser = {
                name: name,
                email: email,
                role: role,
                password: password,
            };

            users.push(newUser);
            localStorage.setItem("registeredUsers", JSON.stringify(users));

            systemDb.users = Array.isArray(systemDb.users) ? systemDb.users : [];
            systemDb.users.push({
                id: `account-${Date.now()}`,
                name,
                role: role === "admin" ? "Admin" : role === "student" ? "Student" : "Employee",
                dept: "General",
                email,
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            });
            addAuthNotification(systemDb, "signup", name, email, role);
            localStorage.setItem("EDUHR_SYSTEM_DB", JSON.stringify(systemDb));

            localStorage.setItem(
                "signupSuccess",
                "Account created successfully! Please sign in with your credentials.",
            );

            window.location.href = "signin.html";
        });
    }

    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
        const signupSuccessMsg = localStorage.getItem("signupSuccess");
        if (signupSuccessMsg) {
            showAlert(signupSuccessMsg, "success");
            localStorage.removeItem("signupSuccess");
        }

        signinForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document
                .getElementById("signin-email")
                .value.trim()
                .toLowerCase();
            const password = document.getElementById("signin-password").value;
            const selectedRole = document.getElementById("signin-role").value;

            let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

            const foundUser = users.find(
                (u) => u.email === email && u.password === password,
            );

            if (!foundUser) {
                showAlert(
                    "Invalid email or password! Please check or sign up first.",
                    "error",
                );
                return;
            }

            if (foundUser.role !== selectedRole) {
                showAlert(
                    `This account is registered as '${foundUser.role.toUpperCase()}'. Please select the correct role.`,
                    "error",
                );
                return;
            }
            localStorage.setItem("userRole", foundUser.role);
            localStorage.setItem("userEmail", foundUser.email);
            localStorage.setItem("userName", foundUser.name);
            localStorage.setItem("isLoggedIn", "true");

            const systemDb = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB")) || {};
            addAuthNotification(systemDb, "login", foundUser.name, foundUser.email, foundUser.role);
            systemDb.auditLogs = Array.isArray(systemDb.auditLogs) ? systemDb.auditLogs : [];
            systemDb.auditLogs.unshift(`[${new Date().toLocaleTimeString()}] ${foundUser.role} ${foundUser.name} logged into portal.`);
            localStorage.setItem("EDUHR_SYSTEM_DB", JSON.stringify(systemDb));

            showAlert("Login successful! Redirecting...", "success");

            setTimeout(() => {
                if (foundUser.role === "admin") {
                    window.location.href = "employee-dashboard/admin.html";
                } else if (foundUser.role === "student") {
                    window.location.href = "employee-dashboard/student.html";
                } else {
                    window.location.href = "employee-dashboard/index.html";
                }
            }, 1000);
        });
    }
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("isLoggedIn");
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
        const emailName = storedEmail.split("@")[0];
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
