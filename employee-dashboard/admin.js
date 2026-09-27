const initialDB = {
    users: [
        {
            id: "1",
            name: "Dr. Sarah Jenkins",
            role: "Super Admin",
            dept: "Executive Management",
            email: "sarah.j@eduhr.com",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        {
            id: "2",
            name: "Prof. Alan Turing",
            role: "Employee",
            dept: "Computer Science",
            email: "alan.t@eduhr.com",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        },
        {
            id: "3",
            name: "Emma Watson",
            role: "Student",
            dept: "Software Engineering",
            email: "emma.w@eduhr.com",
            avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        },
    ],
    attendance: [
        {
            name: "Dr. Sarah Jenkins",
            date: "2026-09-23",
            in: "08:30 AM",
            out: "05:00 PM",
            status: "Present",
        },
        {
            name: "Prof. Alan Turing",
            date: "2026-09-23",
            in: "08:45 AM",
            out: "05:15 PM",
            status: "Present",
        },
        {
            name: "Emma Watson",
            date: "2026-09-23",
            in: "09:00 AM",
            out: "--",
            status: "Present",
        },
    ],
    leaves: [
        {
            name: "Prof. Alan Turing",
            type: "Sick Leave",
            dates: "Sep 25 - Sep 26",
            reason: "Medical Appointment",
            status: "Pending",
        },
    ],
    visitors: [
        {
            name: "David Miller",
            phone: "+1 555-0192",
            host: "Dean HR",
            purpose: "Admission Enquiry",
            time: "10:15 AM",
        },
    ],
    auditLogs: [
        "System initialized successfully.",
        "Super Admin Sarah Jenkins logged into Control Panel.",
    ],
};

let DB = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB")) || initialDB;

function saveDB() {
    localStorage.setItem("EDUHR_SYSTEM_DB", JSON.stringify(DB));
}

function logAudit(action) {
    const time = new Date().toLocaleTimeString();
    DB.auditLogs.unshift(`[${time}] ${action}`);
    saveDB();
    renderAuditLogs();
}

function switchView(viewId) {
    document
        .querySelectorAll(".view-panel")
        .forEach((el) => el.classList.add("hidden"));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach((btn) => {
        if (btn.getAttribute("data-view") === viewId) {
            btn.classList.add(
                "bg-primary-50",
                "dark:bg-slate-700",
                "text-primary-600",
                "font-bold",
            );
        } else {
            btn.classList.remove(
                "bg-primary-50",
                "dark:bg-slate-700",
                "text-primary-600",
                "font-bold",
            );
        }
    });

    if (window.innerWidth < 1024) {
        document.getElementById("sidebar").classList.add("-translate-x-full");
    }
}

function renderDirectory() {
    const tbody = document.getElementById("directoryTableBody");
    if (!tbody) return;
    tbody.innerHTML = DB.users
        .map(
            (u) => `
                <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td class="p-3 flex items-center space-x-2">
                        <img src="${u.avatar}" class="w-7 h-7 rounded-full object-cover">
                        <span class="font-semibold text-slate-800 dark:text-white">${u.name}</span>
                    </td>
                    <td class="p-3"><span class="bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded font-medium text-[10px]">${u.role}</span></td>
                    <td class="p-3">${u.dept}</td>
                    <td class="p-3">${u.email}</td>
                    <td class="p-3 text-right">
                        <button onclick="deleteUser('${u.id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `,
        )
        .join("");

    const pSelect = document.getElementById("payrollUserSelect");
    const idSelect = document.getElementById("idCardUserSelect");
    if (pSelect)
        pSelect.innerHTML = DB.users
            .map((u) => `<option value="${u.name}">${u.name} (${u.role})</option>`)
            .join("");
    if (idSelect)
        idSelect.innerHTML = DB.users
            .map((u) => `<option value="${u.id}">${u.name}</option>`)
            .join("");
}

function filterDirectory() {
    const query = document.getElementById("directorySearch").value.toLowerCase();
    const rows = document.querySelectorAll("#directoryTableBody tr");
    rows.forEach((r) => {
        r.style.display = r.innerText.toLowerCase().includes(query) ? "" : "none";
    });
}

function deleteUser(id) {
    DB.users = DB.users.filter((u) => u.id !== id);
    saveDB();
    logAudit(`Deleted user ID: ${id}`);
    renderDirectory();
}

function openAddUserModal() {
    const name = prompt("Enter Person Full Name:");
    if (name) {
        const role = prompt("Role (Student/Employee/HR Manager):", "Employee");
        const dept = prompt("Department / Class:", "Computer Science");
        const newUser = {
            id: Date.now().toString(),
            name,
            role: role || "Employee",
            dept: dept || "General",
            email: name.toLowerCase().replace(/\s+/g, "") + "@eduhr.com",
            avatar:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        };
        DB.users.push(newUser);
        saveDB();
        logAudit(`Added new user: ${name}`);
        renderDirectory();
    }
}

function renderAttendance() {
    const tbody = document.getElementById("attendanceLogsTable");
    if (!tbody) return;
    tbody.innerHTML = DB.attendance
        .map(
            (a) => `
                <tr class="border-b dark:border-slate-700">
                    <td class="p-3 font-medium">${a.name}</td>
                    <td class="p-3">${a.date}</td>
                    <td class="p-3 text-emerald-600 font-mono">${a.in}</td>
                    <td class="p-3 text-amber-600 font-mono">${a.out}</td>
                    <td class="p-3"><span class="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">${a.status}</span></td>
                </tr>
            `,
        )
        .join("");
}

function renderLeaves() {
    const tbody = document.getElementById("leaveRequestsTable");
    if (!tbody) return;
    tbody.innerHTML = DB.leaves
        .map(
            (l, index) => `
                <tr class="border-b dark:border-slate-700">
                    <td class="p-3 font-semibold">${l.name}</td>
                    <td class="p-3">${l.type}</td>
                    <td class="p-3 font-mono">${l.dates}</td>
                    <td class="p-3">${l.reason}</td>
                    <td class="p-3"><span class="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">${l.status}</span></td>
                    <td class="p-3 text-right">
                        <button onclick="approveLeave(${index})" class="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] mr-1">Approve</button>
                    </td>
                </tr>
            `,
        )
        .join("");
}

function approveLeave(idx) {
    DB.leaves[idx].status = "Approved";
    saveDB();
    logAudit(`Approved leave for ${DB.leaves[idx].name}`);
    renderLeaves();
}

function submitQuickLeave(e) {
    e.preventDefault();
    const start = document.getElementById("userLeaveStart").value;
    const end = document.getElementById("userLeaveEnd").value;
    const type = document.getElementById("userLeaveType").value;
    const reason = document.getElementById("userLeaveReason").value;

    DB.leaves.push({
        name: "Dr. Sarah Jenkins",
        type,
        dates: `${start} - ${end}`,
        reason,
        status: "Pending",
    });
    saveDB();
    logAudit(`Submitted leave application.`);
    alert("Leave application submitted successfully!");
    renderLeaves();
}

function renderVisitorLogs() {
    const tbody = document.getElementById("visitorLogsTable");
    if (!tbody) return;
    tbody.innerHTML = DB.visitors
        .map(
            (v) => `
                <tr class="border-b dark:border-slate-700">
                    <td class="p-3 font-bold">${v.name}</td>
                    <td class="p-3 font-mono">${v.phone}</td>
                    <td class="p-3">${v.host}</td>
                    <td class="p-3">${v.purpose}</td>
                    <td class="p-3 text-slate-500">${v.time}</td>
                </tr>
            `,
        )
        .join("");
}

function submitVisitorGatePass(e) {
    e.preventDefault();
    const name = document.getElementById("vName").value;
    const phone = document.getElementById("vPhone").value;
    const host = document.getElementById("vHost").value;
    const purpose = document.getElementById("vPurpose").value;

    DB.visitors.unshift({
        name,
        phone,
        host,
        purpose,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    });
    saveDB();
    logAudit(`Generated Gate Pass for Visitor: ${name}`);
    alert(`Gate Pass Issued for ${name}! Please show pass at gate.`);
    renderVisitorLogs();
    switchView("v19");
}

function renderPayslipPreview() {
    const name = document.getElementById("payrollUserSelect").value;
    const amount =
        parseFloat(document.getElementById("payrollAmount").value) || 4500;

    document.getElementById("psName").innerText = name;
    document.getElementById("psBase").innerText = `$${amount.toFixed(2)}`;
    document.getElementById("psTotal").innerText =
        `$${(amount + 150).toFixed(2)}`;
}

function updateIDCard() {
    const id = document.getElementById("idCardUserSelect").value;
    const user = DB.users.find((u) => u.id === id);
    if (user) {
        document.getElementById("idCardName").innerText = user.name;
        document.getElementById("idCardRole").innerText = user.role;
        document.getElementById("idCardDept").innerText = `Dept: ${user.dept}`;
        document.getElementById("idCardImg").src = user.avatar;
    }
}

function renderAuditLogs() {
    const box = document.getElementById("auditLogsContainer");
    if (box) {
        box.innerHTML = DB.auditLogs
            .map(
                (l) =>
                    `<div class="p-1.5 border-b border-slate-100 dark:border-slate-700/40 text-slate-600 dark:text-slate-400">⚡ ${l}</div>`,
            )
            .join("");
    }
}

function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById("loginRole").value;
    document.getElementById("activeRoleBadge").innerText = role;
    logAudit(`User logged in as ${role}`);
    switchView("v3");
}

function handleRegister(e) {
    e.preventDefault();
    const first = document.getElementById("regFirstName").value;
    const last = document.getElementById("regLastName").value;
    const email = document.getElementById("regEmail").value;
    const role = document.getElementById("regRole").value;
    const dept = document.getElementById("regDept").value;

    DB.users.push({
        id: Date.now().toString(),
        name: `${first} ${last}`,
        role,
        dept,
        email,
        avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    });
    saveDB();
    logAudit(`Registered new user ${first} ${last}`);
    alert("Registration Successful! Please login now.");
    renderDirectory();
    switchView("v4");
}

function exportJSONData() {
    const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(DB, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
        "download",
        `EduHR_Database_Backup_${Date.now()}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logAudit("Exported full system JSON database backup.");
}

function importJSONData(e) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const parsed = JSON.parse(event.target.result);
            DB = parsed;
            saveDB();
            alert("System Data Restored Successfully!");
            location.reload();
        } catch (err) {
            alert("Invalid JSON file format!");
        }
    };
    fileReader.readAsText(e.target.files[0]);
}

function resetSystemData() {
    if (confirm("Are you sure you want to reset system data to defaults?")) {
        localStorage.removeItem("EDUHR_SYSTEM_DB");
        DB = initialDB;
        saveDB();
        location.reload();
    }
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
}

window.onload = function () {
    renderDirectory();
    renderAttendance();
    renderLeaves();
    renderVisitorLogs();
    renderAuditLogs();

    switchView("v1");

    document.getElementById("sidebarToggle").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("-translate-x-full");
    });

    document
        .getElementById("themeToggle")
        .addEventListener("click", toggleDarkMode);

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "../signin.html";
        });
    }

    const ctx1 = document.getElementById("adminAttendanceChart");
    if (ctx1) {
        new Chart(ctx1.getContext("2d"), {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                    {
                        label: "Attendance %",
                        data: [92, 95, 94, 96, 91, 88],
                        borderColor: "#0284c7",
                        backgroundColor: "rgba(2, 132, 199, 0.1)",
                        fill: true,
                        tension: 0.3,
                    },
                ],
            },
            options: { responsive: true, maintainAspectRatio: false },
        });
    }

    const ctx2 = document.getElementById("adminDeptChart");
    if (ctx2) {
        new Chart(ctx2.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Faculty", "Students", "HR Staff", "Admin Support"],
                datasets: [
                    {
                        data: [120, 850, 25, 45],
                        backgroundColor: ["#0284c7", "#10b981", "#f59e0b", "#6366f1"],
                    },
                ],
            },
            options: { responsive: true, maintainAspectRatio: false },
        });
    }
};
