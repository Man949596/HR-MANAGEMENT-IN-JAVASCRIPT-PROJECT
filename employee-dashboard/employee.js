const DB_KEY = "EDUHR_SYSTEM_DB";

function getEmployeeDB() {
    const fallback = { users: [], attendance: [], leaves: [], notifications: [] };
    try {
        const parsed = JSON.parse(localStorage.getItem(DB_KEY));
        return {
            ...fallback,
            ...parsed,
            users: Array.isArray(parsed?.users) ? parsed.users : [],
            attendance: Array.isArray(parsed?.attendance) ? parsed.attendance : [],
            leaves: Array.isArray(parsed?.leaves) ? parsed.leaves : [],
            notifications: Array.isArray(parsed?.notifications) ? parsed.notifications : [],
        };
    } catch {
        return fallback;
    }
}

function getCurrentEmployee() {
    const email = (localStorage.getItem("userEmail") || "").toLowerCase();
    const name = localStorage.getItem("userName") || "Employee";
    const db = getEmployeeDB();
    const account = db.users.find((user) => user.email?.toLowerCase() === email);
    return {
        email,
        name: account?.name || name,
        identity: email || (account?.name || name).toLowerCase(),
    };
}

function matchesEmployee(record, employee) {
    const recordEmail = record.email?.toLowerCase();
    return recordEmail === employee.email || record.name?.toLowerCase() === employee.name.toLowerCase();
}

function renderEmployeeDashboard() {
    const db = getEmployeeDB();
    const employee = getCurrentEmployee();
    const isStudent = localStorage.getItem("userRole") === "student";
    const attendance = db.attendance.filter((record) => matchesEmployee(record, employee));
    const leaves = db.leaves.filter((record) => matchesEmployee(record, employee));
    const notifications = db.notifications.filter((item) => item.target === "all" || item.target === employee.email || item.target === employee.identity);
    const unread = notifications.filter((item) => !Array.isArray(item.readBy) || !item.readBy.includes(employee.identity));

    document.getElementById("dash-user-name").textContent = employee.name;
    document.getElementById("welcome-user-name").textContent = employee.name;
    document.getElementById("employee-account-email").textContent = employee.email || "Not available";
    document.getElementById("portal-page-title").textContent = isStudent ? "Student Portal" : "Employee Portal";
    document.getElementById("portal-role-badge").textContent = isStudent ? "Student" : "Employee";
    document.getElementById("portal-brand").innerHTML = isStudent ? "Student<span class=\"text-gold\">Portal</span>" : "Employee<span class=\"text-gold\">Portal</span>";
    document.getElementById("employee-present-days").textContent = attendance.filter((item) => item.status === "Present").length;
    document.getElementById("employee-leave-count").textContent = leaves.length;
    document.getElementById("employee-unread-count").textContent = unread.length;

    const attendanceList = document.getElementById("employee-attendance-list");
    attendanceList.innerHTML = attendance.length ? attendance.slice(0, 8).map((item) => `
        <tr><td>${item.date}</td><td>${item.in}</td><td>${item.out}</td><td><span class="status-badge ${item.status === "Present" ? "status-active" : "status-pending"}">${item.status}</span></td></tr>
    `).join("") : '<tr><td colspan="4">No attendance records published yet.</td></tr>';

    const leaveList = document.getElementById("employee-leave-list");
    leaveList.innerHTML = leaves.length ? leaves.map((item) => `
        <tr><td>${item.dates}</td><td>${item.type}</td><td>${item.reason}</td><td><span class="status-badge ${item.status === "Approved" ? "status-active" : "status-pending"}">${item.status}</span></td></tr>
    `).join("") : '<tr><td colspan="4">No leave requests found.</td></tr>';

    const notificationList = document.getElementById("employee-notification-list");
    notificationList.innerHTML = notifications.length ? notifications.map((item) => `
        <article class="p-4 rounded-xl border ${unread.includes(item) ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white"}">
            <h3 class="font-bold text-sm">${item.title}</h3>
            <p class="text-sm text-gray-600 mt-1">${item.message}</p>
            <time class="text-xs text-gray-400 block mt-2">${new Date(item.createdAt).toLocaleString()}</time>
        </article>
    `).join("") : '<p class="text-sm text-gray-500">No notifications yet.</p>';

    const count = document.getElementById("sidebar-notification-count");
    count.textContent = unread.length;
    count.classList.toggle("hidden", unread.length === 0);
    document.getElementById("employee-notification-dot").classList.toggle("hidden", unread.length === 0);
}

function showEmployeeSection(sectionId) {
    document.querySelectorAll(".employee-section").forEach((section) => section.classList.add("hidden"));
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove("hidden");
    document.querySelectorAll(".sidebar-link").forEach((link) => link.classList.toggle("active", link.dataset.section === sectionId));
}

function markEmployeeNotificationsRead() {
    const db = getEmployeeDB();
    const employee = getCurrentEmployee();
    db.notifications.forEach((item) => {
        item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
        if ((item.target === "all" || item.target === employee.email) && !item.readBy.includes(employee.identity)) {
            item.readBy.push(employee.identity);
        }
    });
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    renderEmployeeDashboard();
}

function submitEmployeeLeave(event) {
    event.preventDefault();
    const db = getEmployeeDB();
    const employee = getCurrentEmployee();
    db.leaves.push({
        name: employee.name,
        email: employee.email,
        type: document.getElementById("employee-leave-type").value,
        dates: `${document.getElementById("employee-leave-start").value} - ${document.getElementById("employee-leave-end").value}`,
        reason: document.getElementById("employee-leave-reason").value.trim(),
        status: "Pending",
    });
    db.auditLogs = Array.isArray(db.auditLogs) ? db.auditLogs : [];
    db.auditLogs.unshift(`[${new Date().toLocaleTimeString()}] Leave request submitted by ${employee.name}`);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    event.target.reset();
    renderEmployeeDashboard();
    showToast("Leave request submitted", "Your request is now visible to HR for approval.");
}

document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("userRole");
    if (localStorage.getItem("isLoggedIn") !== "true" || !["employee", "student"].includes(role)) {
        window.location.replace("../signin.html");
        return;
    }

    const currentEmail = (localStorage.getItem("userEmail") || "").toLowerCase();
    const hasActiveAccount = getEmployeeDB().users.some((user) => user.email?.toLowerCase() === currentEmail);
    if (!hasActiveAccount) {
        ["userRole", "userEmail", "userName", "isLoggedIn"].forEach((key) => localStorage.removeItem(key));
        window.location.replace("../signin.html");
        return;
    }

    renderEmployeeDashboard();
    const leaveForm = document.getElementById("employee-leave-form");
    if (leaveForm) leaveForm.addEventListener("submit", submitEmployeeLeave);
    const notificationButton = document.querySelector(".dash-icon-btn");
    if (notificationButton) {
        notificationButton.addEventListener("click", () => {
            showEmployeeSection("notifications");
            markEmployeeNotificationsRead();
        });
    }
    document.querySelectorAll(".sidebar-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionId = link.dataset.section;
            showEmployeeSection(sectionId);
            if (sectionId === "notifications") markEmployeeNotificationsRead();
        });
    });
    window.addEventListener("storage", (event) => {
        if (event.key === DB_KEY) {
            const stillActive = getEmployeeDB().users.some((user) => user.email?.toLowerCase() === currentEmail);
            if (!stillActive) {
                ["userRole", "userEmail", "userName", "isLoggedIn"].forEach((key) => localStorage.removeItem(key));
                window.location.replace("../signin.html");
                return;
            }
            renderEmployeeDashboard();
        }
    });
});
