document.addEventListener("DOMContentLoaded", function () {
    const databaseKey = "EDUHR_SYSTEM_DB_V2";
    const defaultAccounts = [
        { name: "HR Administrator", email: "admin9495@gmail.com", role: "admin", password: "Admin9495!" },
        { name: "Alan Turing", email: "employee9495@gmail.com", role: "employee", password: "Employee9495!" },
    ];

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function readDatabase() {
        try {
            const database = JSON.parse(localStorage.getItem(databaseKey) || "{}");
            return database && typeof database === "object" && !Array.isArray(database) ? database : {};
        } catch (error) {
            return {};
        }
    }

    function saveDatabase(database) {
        try {
            localStorage.setItem(databaseKey, JSON.stringify(database));
            return true;
        } catch (error) {
            return false;
        }
    }

    const initialUsers = readArray("registeredUsers");
    defaultAccounts.forEach((account) => {
        if (!initialUsers.some((user) => user.email === account.email)) initialUsers.push(account);
    });
    try {
        localStorage.setItem("registeredUsers", JSON.stringify(initialUsers));
    } catch (error) {
    }

    const initialDatabase = readDatabase();
    try {
        const legacyDatabase = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB") || "{}");
        ["users", "attendance", "leaves", "notifications", "auditLogs"].forEach((key) => {
            if (!Array.isArray(legacyDatabase[key])) return;
            initialDatabase[key] = Array.isArray(initialDatabase[key]) ? initialDatabase[key] : [];
            legacyDatabase[key].forEach((record) => {
                const isDuplicate = record.id && initialDatabase[key].some((item) => item.id === record.id);
                if (!isDuplicate) initialDatabase[key].push(record);
            });
        });
    } catch (error) {
    }
    initialDatabase.users = Array.isArray(initialDatabase.users) ? initialDatabase.users : [];
    initialDatabase.attendance = Array.isArray(initialDatabase.attendance) ? initialDatabase.attendance : [];
    initialDatabase.leaves = Array.isArray(initialDatabase.leaves) ? initialDatabase.leaves : [];
    initialDatabase.notifications = Array.isArray(initialDatabase.notifications) ? initialDatabase.notifications : [];
    initialDatabase.announcements = Array.isArray(initialDatabase.announcements) ? initialDatabase.announcements : [];
    initialDatabase.notifications.forEach((item) => {
        if (item.target || item.title === "Welcome Admin") return;
        if (!initialDatabase.announcements.some((announcement) => announcement.id === item.id)) {
            initialDatabase.announcements.push({ ...item, createdAt: item.createdAt || new Date().toISOString() });
        }
    });
    initialUsers.forEach((account) => {
        if (!initialDatabase.users.some((user) => user.email === account.email)) {
            initialDatabase.users.push({
                id: `account-${account.email}`,
                name: account.name,
                role: account.role === "admin" ? "Admin" : "Employee",
                dept: "General",
                designation: account.role === "admin" ? "Administrator" : "Employee",
                email: account.email,
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
                joiningDate: "2026-01-01",
                status: "Active",
            });
        }
    });
    saveDatabase(initialDatabase);

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
            title: action === "signup" ? "New account signup" : role === "employee" ? "Employee login" : "Login activity",
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
            const role = "employee";
            const password = document.getElementById("signup-password").value;

            const users = readArray("registeredUsers");
            const systemDb = readDatabase();
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
            try {
                localStorage.setItem("registeredUsers", JSON.stringify(users));
            } catch (error) {
                showAlert("Your browser could not save this account. Check available storage and try again.", "error");
                return;
            }

            systemDb.users = Array.isArray(systemDb.users) ? systemDb.users : [];
            systemDb.users.push({
                id: `account-${email}`,
                name,
                role: "Employee",
                dept: "General",
                designation: "Employee",
                email,
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
                joiningDate: new Date().toISOString().slice(0, 10),
                status: "Active",
            });
            addAuthNotification(systemDb, "signup", name, email, role);
            if (!saveDatabase(systemDb)) {
                showAlert("Your account could not be saved. Check available browser storage and try again.", "error");
                return;
            }

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

            const users = readArray("registeredUsers");

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

            const accountRole = String(foundUser.role || "").toLowerCase();

            const systemDb = readDatabase();
            const deletedEmails = Array.isArray(systemDb.deletedUserEmails) ? systemDb.deletedUserEmails : [];
            const profile = (Array.isArray(systemDb.users) ? systemDb.users : []).find((user) => user.email === email);
            if (deletedEmails.includes(email) || profile?.status === "Inactive") {
                showAlert("This account is inactive. Contact your HR administrator.", "error");
                return;
            }
            if (!['admin', 'employee'].includes(accountRole)) {
                showAlert("This account role is not supported. Contact your HR administrator.", "error");
                return;
            }

            if (accountRole !== selectedRole) {
                showAlert(
                    `This account is registered as '${accountRole.toUpperCase()}'. Please select the correct role.`,
                    "error",
                );
                return;
            }
            localStorage.setItem("userRole", accountRole);
            localStorage.setItem("userEmail", foundUser.email);
            localStorage.setItem("userName", foundUser.name);
            localStorage.setItem("isLoggedIn", "true");

            addAuthNotification(systemDb, "login", foundUser.name, foundUser.email, accountRole);
            systemDb.auditLogs = Array.isArray(systemDb.auditLogs) ? systemDb.auditLogs : [];
            systemDb.auditLogs.unshift(`[${new Date().toLocaleTimeString()}] ${accountRole} ${foundUser.name} logged into portal.`);
            if (!saveDatabase(systemDb)) {
                showAlert("Login succeeded, but activity could not be saved to browser storage.", "error");
                return;
            }

            showAlert("Login successful! Redirecting...", "success");

            setTimeout(() => {
                if (accountRole === "admin") {
                    window.location.href = "employee-dashboard/admin.html";
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