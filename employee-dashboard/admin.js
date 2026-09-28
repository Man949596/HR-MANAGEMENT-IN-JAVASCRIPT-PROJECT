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
    notifications: [
        {
            id: "welcome-notification",
            title: "Welcome to EduHR",
            message: "The employee portal is now connected to the HR control center.",
            target: "all",
            createdAt: new Date().toISOString(),
            readBy: [],
        },
    ],
    jobs: [
        { id: "job-1", title: "Senior Faculty - Computer Science", department: "Computer Science", applicants: 12, status: "Open" },
        { id: "job-2", title: "HR Operations Coordinator", department: "Human Resources", applicants: 7, status: "Open" },
    ],
    performance: [
        { userId: "1", score: 4.8, goal: "Leadership and strategic planning" },
        { userId: "2", score: 4.4, goal: "Teaching quality and research" },
    ],
    courses: [
        { id: "course-1", title: "Workplace Safety & Compliance", instructor: "HR Learning Team", enrolled: 34 },
        { id: "course-2", title: "Modern Teaching Tools", instructor: "Academic Excellence", enrolled: 21 },
    ],
    assets: [
        { tag: "AST-1001", name: "MacBook Pro 14", assigned: "Prof. Alan Turing", status: "Assigned" },
        { tag: "AST-1002", name: "Biometric Scanner", assigned: "HR Office", status: "Available" },
    ],
    tickets: [
        { id: "TCK-101", subject: "Unable to access payroll slip", requester: "Prof. Alan Turing", priority: "High", status: "Open" },
    ],
    expenses: [
        { id: "EXP-101", claimant: "Prof. Alan Turing", category: "Conference Travel", amount: 380, status: "Pending" },
        { id: "EXP-102", claimant: "Dr. Sarah Jenkins", category: "Office Supplies", amount: 125, status: "Approved" },
    ],
    tasks: [
        { id: "TASK-1", title: "Prepare Term Mid-Exams", status: "To Do" },
        { id: "TASK-2", title: "Audit Faculty Attendance", status: "To Do" },
        { id: "TASK-3", title: "Disburse September Payroll", status: "In Progress" },
        { id: "TASK-4", title: "Campus Wi-Fi Upgrade", status: "Completed" },
    ],
    documents: [
        { id: "DOC-1", name: "Institute HR Policy 2026.pdf", updated: "12 days ago" },
        { id: "DOC-2", name: "Academic Accreditation Certificate.pdf", updated: "1 month ago" },
    ],
    timetable: [
        { time: "09:00 - 10:30", Monday: "CS101 - Lecture", Tuesday: "Staff Shift A", Wednesday: "CS101 - Lecture", Thursday: "Faculty Seminar", Friday: "Lab Session" },
        { time: "11:00 - 12:30", Monday: "HR Workshop", Tuesday: "CS101 - Lab", Wednesday: "Staff Shift A", Thursday: "CS101 - Lab", Friday: "Guest Lecture" },
    ],
    onboarding: { identity: true, education: true, background: false, bank: false },
    settings: { darkMode: false },
};

let DB = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB")) || initialDB;
DB.deletedUserEmails = Array.isArray(DB.deletedUserEmails) ? DB.deletedUserEmails : [];
DB.notifications = Array.isArray(DB.notifications) ? DB.notifications : [];
DB.leaves = Array.isArray(DB.leaves) ? DB.leaves : [];
DB.attendance = Array.isArray(DB.attendance) ? DB.attendance : [];
DB.auditLogs = Array.isArray(DB.auditLogs) ? DB.auditLogs : [];
DB.jobs = Array.isArray(DB.jobs) ? DB.jobs : initialDB.jobs;
DB.performance = Array.isArray(DB.performance) ? DB.performance : initialDB.performance;
DB.courses = Array.isArray(DB.courses) ? DB.courses : initialDB.courses;
DB.assets = Array.isArray(DB.assets) ? DB.assets : initialDB.assets;
DB.tickets = Array.isArray(DB.tickets) ? DB.tickets : initialDB.tickets;
DB.expenses = Array.isArray(DB.expenses) ? DB.expenses : initialDB.expenses;
DB.tasks = Array.isArray(DB.tasks) ? DB.tasks : initialDB.tasks;
DB.documents = Array.isArray(DB.documents) ? DB.documents : initialDB.documents;
DB.timetable = Array.isArray(DB.timetable) ? DB.timetable : initialDB.timetable;
DB.onboarding = { ...initialDB.onboarding, ...(DB.onboarding || {}) };
DB.settings = { ...initialDB.settings, ...(DB.settings || {}) };

const legacyStudentEmail = "emma.w@eduhr.com";
DB.users = DB.users.filter((user) => user.email?.toLowerCase() !== legacyStudentEmail);
DB.attendance = DB.attendance.filter((record) => record.name !== "Emma Watson" && record.email?.toLowerCase() !== legacyStudentEmail);
DB.leaves = DB.leaves.filter((record) => record.name !== "Emma Watson" && record.email?.toLowerCase() !== legacyStudentEmail);
DB.tickets = DB.tickets.filter((ticket) => ticket.requester !== "Emma Watson");
localStorage.setItem("EDUHR_SYSTEM_DB", JSON.stringify(DB));

function saveDB() {
    localStorage.setItem("EDUHR_SYSTEM_DB", JSON.stringify(DB));
}

function logAudit(action) {
    const time = new Date().toLocaleTimeString();
    DB.auditLogs.unshift(`[${time}] ${action}`);
    saveDB();
    renderAuditLogs();
}

function notifyEmployee(title, message, target = "all") {
    DB.notifications = Array.isArray(DB.notifications) ? DB.notifications : [];
    DB.notifications.unshift({
        id: `admin-update-${Date.now()}`,
        title,
        message,
        target,
        createdAt: new Date().toISOString(),
        readBy: [],
    });
    saveDB();
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

function renderAdminDataViews() {
    const findUser = (name) => DB.users.find((user) => user.name === name);
    const jobs = document.getElementById("atsJobList");
    if (jobs) jobs.innerHTML = DB.jobs.map((job) => `<article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"><div class="flex justify-between gap-2"><h3 class="font-bold text-sm">${job.title}</h3><span class="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-700">${job.status}</span></div><p class="text-xs text-slate-500 mt-2">${job.department}</p><p class="text-xs mt-3"><strong>${job.applicants}</strong> applicants</p><button onclick="updateJobStatus('${job.id}')" class="mt-3 text-xs text-primary-600 hover:underline">Change status</button></article>`).join("");

    const performance = document.getElementById("kpiPerformanceContainer");
    if (performance) performance.innerHTML = DB.performance.map((item) => { const user = DB.users.find((candidate) => candidate.id === item.userId); return `<article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"><div class="flex justify-between"><strong class="text-sm">${user?.name || "Unknown user"}</strong><span class="text-amber-600 font-bold">${item.score}/5</span></div><p class="text-xs text-slate-500 mt-2">${item.goal}</p><button onclick="editPerformance('${item.userId}')" class="text-xs text-primary-600 hover:underline mt-3">Update score</button></article>`; }).join("");

    const courses = document.getElementById("trainingCoursesContainer");
    if (courses) courses.innerHTML = DB.courses.map((course) => `<article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"><h3 class="font-bold text-sm">${course.title}</h3><p class="text-xs text-slate-500 mt-2">${course.instructor}</p><p class="text-xs mt-3">${course.enrolled} enrolled</p><button onclick="enrollCourse('${course.id}')" class="mt-3 text-xs text-primary-600 hover:underline">Add enrolment</button></article>`).join("");

    const assets = document.getElementById("assetsTable");
    if (assets) assets.innerHTML = DB.assets.map((asset) => `<tr class="border-b dark:border-slate-700"><td class="p-3 font-mono">${asset.tag}</td><td class="p-3">${asset.name}</td><td class="p-3">${asset.assigned}</td><td class="p-3"><button onclick="toggleAssetStatus('${asset.tag}')" class="text-xs font-bold ${asset.status === "Available" ? "text-emerald-600" : "text-amber-600"}">${asset.status}</button></td></tr>`).join("");

    const tickets = document.getElementById("helpdeskList");
    if (tickets) tickets.innerHTML = DB.tickets.map((ticket) => `<article class="p-3 border rounded-lg dark:border-slate-700"><div class="flex justify-between gap-2"><strong class="text-xs">${ticket.subject}</strong><span class="text-[10px] font-bold">${ticket.priority}</span></div><p class="text-[11px] text-slate-500 mt-1">${ticket.requester} · ${ticket.id}</p><button onclick="closeTicket('${ticket.id}')" class="text-xs text-primary-600 hover:underline mt-2">${ticket.status === "Closed" ? "Reopen" : "Resolve ticket"}</button></article>`).join("");

    const expenses = document.getElementById("expenseTable");
    if (expenses) expenses.innerHTML = DB.expenses.map((expense) => `<tr class="border-b dark:border-slate-700"><td class="p-3">${expense.claimant}</td><td class="p-3">${expense.category}</td><td class="p-3">$${Number(expense.amount).toFixed(2)}</td><td class="p-3"><button onclick="toggleExpense('${expense.id}')" class="text-xs font-bold ${expense.status === "Approved" ? "text-emerald-600" : "text-amber-600"}">${expense.status}</button></td></tr>`).join("");

    const tasks = document.getElementById("kanbanBoard");
    if (tasks) tasks.innerHTML = ["To Do", "In Progress", "Completed"].map((status) => `<div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700"><h3 class="font-bold text-xs uppercase text-slate-500 mb-3">${status}</h3><div class="space-y-2">${DB.tasks.filter((task) => task.status === status).map((task) => `<button onclick="advanceTask('${task.id}')" class="block w-full text-left bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm text-xs font-medium">${task.title}</button>`).join("") || '<p class="text-xs text-slate-400">No tasks</p>'}</div></div>`).join("");

    const documents = document.getElementById("documentVault");
    if (documents) documents.innerHTML = DB.documents.map((doc) => `<article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3"><i class="fa-solid fa-file-pdf text-red-500 text-2xl"></i><div><div class="font-bold text-xs">${doc.name}</div><div class="text-[10px] text-slate-500">Updated ${doc.updated}</div></div><button onclick="removeDocument('${doc.id}')" class="ml-auto text-red-500"><i class="fa-solid fa-trash"></i></button></article>`).join("");
    renderOnboarding();
    renderTimetable();
    updateDashboardKPIs();
}

function updateDashboardKPIs() {
    const total = document.getElementById("kpiTotalUsers");
    const present = document.getElementById("kpiPresent");
    const tickets = document.getElementById("kpiTickets");
    if (total) total.textContent = DB.users.length.toLocaleString();
    if (present) present.textContent = DB.attendance.filter((item) => item.status === "Present").length.toLocaleString();
    if (tickets) tickets.textContent = DB.tickets.filter((item) => item.status !== "Closed").length;
}

function renderOnboarding() {
    document.querySelectorAll("#onboardingChecklist input[data-check]").forEach((input) => { input.checked = Boolean(DB.onboarding[input.dataset.check]); });
}

function renderTimetable() {
    const body = document.getElementById("timetableBody");
    if (!body) return;
    body.innerHTML = DB.timetable.map((row) => `<tr><td class="p-2 border font-bold bg-slate-50 dark:bg-slate-800">${row.time}</td>${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => `<td class="p-2 border"><button onclick="editTimetable('${row.time}', '${day}')" class="text-xs hover:text-primary-600">${row[day]}</button></td>`).join("")}</tr>`).join("");
}

function updateJobStatus(id) { const job = DB.jobs.find((item) => item.id === id); if (job) { job.status = job.status === "Open" ? "Closed" : "Open"; saveDB(); logAudit(`Updated recruitment status: ${job.title}`); renderAdminDataViews(); } }
function editPerformance(userId) { const item = DB.performance.find((entry) => entry.userId === userId); if (item) { const score = Number(prompt("Enter performance score from 0 to 5:", item.score)); if (score >= 0 && score <= 5) { item.score = score; saveDB(); logAudit(`Updated performance score for ${userId}`); renderAdminDataViews(); } } }
function enrollCourse(id) { const course = DB.courses.find((item) => item.id === id); if (course) { course.enrolled += 1; saveDB(); renderAdminDataViews(); } }
function toggleAssetStatus(tag) { const asset = DB.assets.find((item) => item.tag === tag); if (asset) { asset.status = asset.status === "Available" ? "Assigned" : "Available"; saveDB(); logAudit(`Changed asset status: ${tag}`); renderAdminDataViews(); } }
function closeTicket(id) { const ticket = DB.tickets.find((item) => item.id === id); if (ticket) { ticket.status = ticket.status === "Closed" ? "Open" : "Closed"; saveDB(); logAudit(`Updated ticket ${id}`); renderAdminDataViews(); } }
function toggleExpense(id) { const expense = DB.expenses.find((item) => item.id === id); if (expense) { expense.status = expense.status === "Approved" ? "Pending" : "Approved"; saveDB(); logAudit(`Updated expense ${id}`); renderAdminDataViews(); } }
function advanceTask(id) { const task = DB.tasks.find((item) => item.id === id); if (task) { const statuses = ["To Do", "In Progress", "Completed"]; task.status = statuses[(statuses.indexOf(task.status) + 1) % statuses.length]; saveDB(); logAudit(`Moved task: ${task.title}`); renderAdminDataViews(); } }
function removeDocument(id) { DB.documents = DB.documents.filter((item) => item.id !== id); saveDB(); logAudit(`Removed document ${id}`); renderAdminDataViews(); }
function editTimetable(time, day) { const row = DB.timetable.find((item) => item.time === time); if (row) { const value = prompt(`Enter schedule for ${day}:`, row[day]); if (value?.trim()) { row[day] = value.trim(); saveDB(); logAudit(`Updated timetable: ${day} ${time}`); renderTimetable(); } } }
function toggleOnboarding(key) { DB.onboarding[key] = !DB.onboarding[key]; saveDB(); logAudit(`Updated onboarding checklist: ${key}`); }

function filterDirectory() {
    const query = document.getElementById("directorySearch").value.toLowerCase();
    const rows = document.querySelectorAll("#directoryTableBody tr");
    rows.forEach((r) => {
        r.style.display = r.innerText.toLowerCase().includes(query) ? "" : "none";
    });
}

function deleteUser(id) {
    const deletedUser = DB.users.find((user) => user.id === id);
    if (!deletedUser) return;

    const deletedEmail = deletedUser.email?.toLowerCase();
    DB.users = DB.users.filter((u) => u.id !== id);
    if (deletedEmail) {
        if (!DB.deletedUserEmails.includes(deletedEmail)) DB.deletedUserEmails.push(deletedEmail);
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers.filter((user) => user.email?.toLowerCase() !== deletedEmail)));
        DB.attendance = DB.attendance.filter((record) => record.email ? record.email.toLowerCase() !== deletedEmail : record.name !== deletedUser.name);
        DB.leaves = DB.leaves.filter((record) => record.email ? record.email.toLowerCase() !== deletedEmail : record.name !== deletedUser.name);
    }
    DB.performance = DB.performance.filter((item) => item.userId !== id);
    saveDB();
    logAudit(`Deleted user ID: ${id}`);
    renderDirectory();
    renderAttendance();
    renderLeaves();
    renderAdminDataViews();
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
    const leave = DB.leaves[idx];
    if (!leave || leave.status === "Approved") return;
    leave.status = "Approved";
    notifyEmployee(
        "Leave request approved",
        `Your ${leave.type} request for ${leave.dates} was approved by HR.`,
        leave.email || "all",
    );
    logAudit(`Approved leave for ${leave.name}`);
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
    const user = DB.users.find((item) => item.name === name);
    const amount =
        parseFloat(document.getElementById("payrollAmount").value) || 4500;

    document.getElementById("psName").innerText = name;
    document.getElementById("psRole").innerText = user?.role || "Employee";
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

function renderAdminNotifications() {
    const list = document.getElementById("adminNotificationList");
    const count = document.getElementById("notifCount");
    if (!list || !count) return;

    const notifications = DB.notifications || [];
    const unread = notifications.filter((item) => (item.target === "admin" || item.target === "all") && (!Array.isArray(item.readBy) || !item.readBy.includes("admin")));
    count.textContent = unread.length;
    count.classList.toggle("hidden", unread.length === 0);
    list.innerHTML = notifications.length
        ? notifications.map((item) => `
            <div class="p-3 border-b border-slate-100 dark:border-slate-700/50">
                <div class="text-xs font-bold text-slate-800 dark:text-white">${item.title}</div>
                <div class="text-[11px] text-slate-500 mt-1">${item.message}</div>
                <div class="text-[10px] text-slate-400 mt-1">${new Date(item.createdAt).toLocaleString()}</div>
            </div>`).join("")
        : '<div class="p-4 text-xs text-slate-500">No notifications yet.</div>';
}

function publishNotice(e) {
    e.preventDefault();
    const title = document.getElementById("noticeTitle").value.trim();
    const message = document.getElementById("noticeMessage").value.trim();
    if (!title || !message) return;

    DB.notifications.unshift({
        id: Date.now().toString(),
        title,
        message,
        target: "all",
        createdAt: new Date().toISOString(),
        readBy: [],
    });
    saveDB();
    logAudit(`Published notice: ${title}`);
    e.target.reset();
    renderAdminNotifications();
    renderNoticeBoard();
}

function renderNoticeBoard() {
    const container = document.getElementById("noticeBoardContainer");
    if (!container) return;
    container.innerHTML = (DB.notifications || []).map((item) => `
        <article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex items-start justify-between gap-3">
                <div><h3 class="text-sm font-bold text-slate-800 dark:text-white">${item.title}</h3>
                <p class="text-xs text-slate-500 mt-1">${item.message}</p></div>
                <span class="text-[10px] text-slate-400 whitespace-nowrap">${new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
        </article>`).join("");
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
    DB.settings.darkMode = document.documentElement.classList.contains("dark");
    saveDB();
}

window.onload = function () {
    if (DB.settings.darkMode) document.documentElement.classList.add("dark");
    renderDirectory();
    renderAttendance();
    renderLeaves();
    renderVisitorLogs();
    renderAuditLogs();
    renderAdminNotifications();
    renderNoticeBoard();
    renderAdminDataViews();

    const noticeForm = document.getElementById("noticeForm");
    if (noticeForm) noticeForm.addEventListener("submit", publishNotice);

    const notifBtn = document.getElementById("notifBtn");
    const notificationPanel = document.getElementById("adminNotifications");
    if (notifBtn && notificationPanel) {
        notifBtn.addEventListener("click", () => notificationPanel.classList.toggle("hidden"));
    }
    const markNotificationsRead = document.getElementById("markNotificationsRead");
    if (markNotificationsRead) {
        markNotificationsRead.addEventListener("click", () => {
            DB.notifications.forEach((item) => {
                item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
                if (!item.readBy.includes("admin")) item.readBy.push("admin");
            });
            saveDB();
            renderAdminNotifications();
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key === "EDUHR_SYSTEM_DB") {
            const previousNotificationIds = new Set(DB.notifications.map((item) => item.id));
            DB = JSON.parse(event.newValue) || initialDB;
            DB.notifications = Array.isArray(DB.notifications) ? DB.notifications : [];
            const newEmployeeLogin = DB.notifications.some((item) =>
                item.title === "Employee login" && !previousNotificationIds.has(item.id)
            );
            renderDirectory();
            renderAdminNotifications();
            if (newEmployeeLogin) {
                document.getElementById("adminNotifications")?.classList.remove("hidden");
            }
            renderNoticeBoard();
            renderLeaves();
            renderAttendance();
        }
    });

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
