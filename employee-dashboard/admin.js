// Initial Mock Database setup
const initialDB = {
    users: [
        {
            id: "1",
            name: "Dr. Sarah Jenkins",
            role: "Super Admin",
            dept: "Executive Management",
            email: "sarah.j@eduhr.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        {
            id: "2",
            name: "Prof. Alan Turing",
            role: "Employee",
            dept: "Computer Science",
            email: "alan.t@eduhr.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        },
    ],
    attendance: [
        { name: "Dr. Sarah Jenkins", date: "2026-09-28", in: "08:30 AM", out: "05:00 PM", status: "Present" },
        { name: "Prof. Alan Turing", date: "2026-09-28", in: "08:45 AM", out: "05:15 PM", status: "Present" },
    ],
    leaves: [
        { name: "Prof. Alan Turing", type: "Sick Leave", dates: "Sep 28 - Sep 29", reason: "Medical Visit", status: "Pending" },
    ],
    notifications: [
        { id: "1", title: "Welcome Admin", message: "Dashboard updated to 15 core features.", createdAt: new Date().toISOString(), readBy: [] },
    ],
    jobs: [
        { id: "job-1", title: "Senior Faculty - Computer Science", department: "Computer Science", applicants: 12, status: "Open" },
        { id: "job-2", title: "HR Coordinator", department: "Human Resources", applicants: 5, status: "Open" },
    ],
    performance: [
        { userId: "1", score: 4.9, goal: "Leadership and Strategy" },
        { userId: "2", score: 4.5, goal: "Academic Teaching Quality" },
    ],
    courses: [
        { id: "c-1", title: "Workplace Compliance", instructor: "HR Dept", enrolled: 28 },
        { id: "c-2", title: "Modern AI in Education", instructor: "CS Dept", enrolled: 45 },
    ],
    assets: [
        { tag: "AST-101", name: "MacBook Pro 14", assigned: "Prof. Alan Turing", status: "Assigned" },
        { tag: "AST-102", name: "Dell Monitor 27", assigned: "HR Dept", status: "Available" },
    ],
    tickets: [
        { id: "TCK-101", subject: "Portal Access Error", requester: "Prof. Alan Turing", priority: "High", status: "Open" },
    ],
    expenses: [
        { id: "EXP-101", claimant: "Prof. Alan Turing", category: "Conference Flight", amount: 350, status: "Pending" },
    ],
    tasks: [
        { id: "TASK-1", title: "Prepare Monthly Report", status: "To Do", assignedTo: "alan.t@eduhr.com", priority: "Medium" },
        { id: "TASK-2", title: "Review Payroll Deductions", status: "In Progress", assignedTo: "alan.t@eduhr.com", priority: "High" },
        { id: "TASK-3", title: "System Feature Audit", status: "Completed" },
    ],
    settings: { darkMode: false }
};

let DB;
try {
    DB = JSON.parse(localStorage.getItem("EDUHR_SYSTEM_DB_V2") || "null") || initialDB;
} catch (error) {
    DB = initialDB;
}
Object.keys(initialDB).forEach((key) => {
    if (Array.isArray(initialDB[key])) {
        if (!Array.isArray(DB[key])) DB[key] = initialDB[key];
    } else if (!DB[key] || typeof DB[key] !== "object") {
        DB[key] = initialDB[key];
    }
});
DB.announcements = Array.isArray(DB.announcements) ? DB.announcements : [];
DB.payslips = Array.isArray(DB.payslips) ? DB.payslips : [];
DB.users = Array.isArray(DB.users) ? DB.users : [];
DB.leaves = Array.isArray(DB.leaves) ? DB.leaves : [];
DB.attendance = Array.isArray(DB.attendance) ? DB.attendance : [];
DB.notifications = Array.isArray(DB.notifications) ? DB.notifications : [];
DB.tasks = Array.isArray(DB.tasks) ? DB.tasks : [];
DB.documents = Array.isArray(DB.documents) ? DB.documents : [];
try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const deletedEmails = Array.isArray(DB.deletedUserEmails) ? DB.deletedUserEmails : [];
    registeredUsers.filter((account) => !deletedEmails.includes(account.email)).forEach((account) => {
        if (!DB.users.some((user) => user.email === account.email)) {
            DB.users.push({
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
} catch (error) {
    DB.users = Array.isArray(DB.users) ? DB.users : [];
}

function saveDB() {
    try {
        localStorage.setItem("EDUHR_SYSTEM_DB_V2", JSON.stringify(DB));
        return true;
    } catch (error) {
        alert("The system could not save this change. Check available browser storage and try again.");
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[character]));
}

// Switching View Logic
function switchView(viewId) {
    document.querySelectorAll(".view-panel").forEach((el) => el.classList.add("hidden"));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach((btn) => {
        if (btn.getAttribute("data-view") === viewId) {
            btn.classList.add("bg-primary-50", "dark:bg-slate-700", "text-primary-600", "font-bold");
        } else {
            btn.classList.remove("bg-primary-50", "dark:bg-slate-700", "text-primary-600", "font-bold");
        }
    });

    if (window.innerWidth < 1024) {
        document.getElementById("sidebar").classList.add("-translate-x-full");
    }
}

// Render Functions for Views
function renderDirectory() {
    const tbody = document.getElementById("directoryTableBody");
    if (!tbody) return;
    tbody.innerHTML = DB.users.map((u) => `
        <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td class="p-3 flex items-center space-x-2">
                <img src="${escapeHTML(u.avatar)}" alt="" class="w-7 h-7 rounded-full object-cover">
                <span class="font-semibold text-slate-800 dark:text-white">${escapeHTML(u.name)}</span>
            </td>
            <td class="p-3"><span class="bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded font-medium text-[10px]">${escapeHTML(u.role)}</span></td>
            <td class="p-3">${escapeHTML(u.dept)}</td>
            <td class="p-3">${escapeHTML(u.email)}</td>
            <td class="p-3 text-right">
                <button onclick="editUser('${escapeHTML(u.id)}')" class="text-primary-600 hover:text-primary-800 mr-2" aria-label="Edit ${escapeHTML(u.name)}"><i class="fa-solid fa-pen"></i></button>
                ${u.status === "Inactive" ? '<span class="text-slate-400">Inactive</span>' : `<button onclick="deleteUser('${escapeHTML(u.id)}')" class="text-red-500 hover:text-red-700" aria-label="Deactivate ${escapeHTML(u.name)}"><i class="fa-solid fa-user-slash"></i></button>`}
            </td>
        </tr>
    `).join("");

    const pSelect = document.getElementById("payrollUserSelect");
    const idSelect = document.getElementById("idCardUserSelect");
    const docSelect = document.getElementById("documentEmployee");
    if (pSelect) pSelect.innerHTML = DB.users.filter((u) => u.status !== "Inactive").map((u) => `<option value="${escapeHTML(u.name)}">${escapeHTML(u.name)} (${escapeHTML(u.role)})</option>`).join("");
    if (idSelect) idSelect.innerHTML = DB.users.filter((u) => u.status !== "Inactive").map((u) => `<option value="${escapeHTML(u.id)}">${escapeHTML(u.name)}</option>`).join("");
    if (docSelect) docSelect.innerHTML = DB.users.filter((u) => u.role.toLowerCase() === "employee" && u.status !== "Inactive").map((u) => `<option value="${escapeHTML(u.id)}">${escapeHTML(u.name)} · ${escapeHTML(u.email)}</option>`).join("");
}

function renderAttendance() {
    const tbody = document.getElementById("attendanceLogsTable");
    if (!tbody) return;
    tbody.innerHTML = DB.attendance.map((a) => `
        <tr class="border-b dark:border-slate-700">
            <td class="p-3 font-medium">${escapeHTML(a.name)}</td>
            <td class="p-3">${escapeHTML(a.date)}</td>
            <td class="p-3 text-emerald-600 font-mono">${escapeHTML(a.in)}</td>
            <td class="p-3 text-amber-600 font-mono">${escapeHTML(a.out)}</td>
            <td class="p-3 font-mono">${escapeHTML(getAttendanceDuration(a))}</td>
            <td class="p-3"><span class="${a.status === "Late" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"} text-[10px] px-2 py-0.5 rounded font-bold">${escapeHTML(a.status)}</span></td>
        </tr>
    `).join("");
}

function getAttendanceDuration(record) {
    if (record.hours && record.out) return `${Number(record.hours).toFixed(2)} hours`;
    if (!record.checkInAt) return record.hours ? `${Number(record.hours).toFixed(2)} hours` : "-";
    const startedAt = new Date(record.checkInAt);
    if (Number.isNaN(startedAt.getTime())) return "-";
    const endedAt = record.checkOutAt ? new Date(record.checkOutAt) : new Date();
    const minutes = Math.max(0, Math.floor((endedAt - startedAt) / 60000));
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function renderLeaves() {
    const tbody = document.getElementById("leaveRequestsTable");
    if (!tbody) return;
    tbody.innerHTML = DB.leaves.map((l, index) => `
        <tr class="border-b dark:border-slate-700">
            <td class="p-3 font-semibold">${escapeHTML(l.name)}</td>
            <td class="p-3">${escapeHTML(l.type)}</td>
            <td class="p-3 font-mono">${escapeHTML(l.dates || `${l.startDate || ""} - ${l.endDate || ""}`)}</td>
            <td class="p-3">${escapeHTML(l.reason)}</td>
            <td class="p-3"><span class="${l.status === "Approved" ? "bg-emerald-100 text-emerald-800" : l.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"} text-[10px] px-2 py-0.5 rounded font-bold">${escapeHTML(l.status)}</span></td>
            <td class="p-3 text-right">
                <button onclick="editLeaveRequest('${escapeHTML(l.id || index)}')" class="bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px]">Edit</button>
                ${l.status === "Pending" ? ` <button onclick="updateLeaveStatus(${index}, 'Approved')" class="bg-emerald-600 text-white px-2 py-1 rounded text-[10px]">Approve</button> <button onclick="updateLeaveStatus(${index}, 'Rejected')" class="bg-red-600 text-white px-2 py-1 rounded text-[10px]">Reject</button>` : ""}
            </td>
        </tr>
    `).join("");
}

function updateLeaveStatus(idx, status) {
    if (DB.leaves[idx]) {
        DB.leaves[idx].status = status;
        DB.notifications.unshift({
            id: `leave-${DB.leaves[idx].id || idx}-${Date.now()}`,
            title: `Leave ${status.toLowerCase()}`,
            message: `Your ${DB.leaves[idx].type} request was ${status.toLowerCase()}.`,
            target: DB.leaves[idx].email,
            createdAt: new Date().toISOString(),
            readBy: [],
        });
        saveDB();
        renderLeaves();
        renderAdminNotifications();
    }
}

function editLeaveRequest(id) {
    const leave = DB.leaves.find((item, index) => String(item.id || index) === id);
    if (!leave) return;
    const type = prompt("Leave type:", leave.type || "Casual Leave");
    if (type === null || !type.trim()) return;
    const startDate = prompt("Start date (YYYY-MM-DD):", leave.startDate || "");
    if (startDate === null) return;
    const endDate = prompt("End date (YYYY-MM-DD):", leave.endDate || "");
    if (endDate === null) return;
    const reason = prompt("Reason:", leave.reason || "");
    if (reason === null || !reason.trim()) return;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(startDate) || !/^\\d{4}-\\d{2}-\\d{2}$/.test(endDate) || endDate < startDate) {
        alert("Enter valid dates with the end date on or after the start date.");
        return;
    }
    Object.assign(leave, {
        type: type.trim(), startDate, endDate,
        dates: `${new Date(`${startDate}T00:00:00`).toLocaleDateString()} - ${new Date(`${endDate}T00:00:00`).toLocaleDateString()}`,
        reason: reason.trim(),
    });
    if (leave.email) DB.notifications.unshift({
        id: `leave-edit-${Date.now()}`, target: leave.email, title: "Leave request updated by HR",
        message: `Your ${leave.type} leave request details were updated by HR.`, createdAt: new Date().toISOString(), readBy: [],
    });
    if (saveDB()) {
        renderLeaves();
        renderAdminNotifications();
    }
}

function approveLeave(idx) {
    updateLeaveStatus(idx, "Approved");
}

function renderAdminDataViews() {
    // ATS
    const jobs = document.getElementById("atsJobList");
    if (jobs) jobs.innerHTML = DB.jobs.map((j) => `
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex justify-between"><h3 class="font-bold text-sm">${j.title}</h3><span class="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-700">${j.status}</span></div>
            <p class="text-xs text-slate-500 mt-2">${j.department}</p>
            <p class="text-xs mt-3"><strong>${j.applicants}</strong> Applicants</p>
        </div>
    `).join("");

    // KPIs
    const perf = document.getElementById("kpiPerformanceContainer");
    if (perf) perf.innerHTML = DB.performance.map((item) => {
        const u = DB.users.find((user) => user.id === item.userId);
        return `
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between"><strong class="text-sm">${u ? u.name : 'User'}</strong><span class="text-amber-600 font-bold">${item.score}/5.0</span></div>
                <p class="text-xs text-slate-500 mt-2">${item.goal}</p>
            </div>
        `;
    }).join("");

    // Training Hub
    const courses = document.getElementById("trainingCoursesContainer");
    if (courses) courses.innerHTML = DB.courses.map((c) => `
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-sm">${c.title}</h3>
            <p class="text-xs text-slate-500 mt-2">Instructor: ${c.instructor}</p>
            <p class="text-xs mt-2">${c.enrolled} Enrolled</p>
        </div>
    `).join("");

    // Asset Inventory
    const assets = document.getElementById("assetsTable");
    if (assets) assets.innerHTML = DB.assets.map((ast) => `
        <tr class="border-b dark:border-slate-700">
            <td class="p-3 font-mono">${ast.tag}</td>
            <td class="p-3">${ast.name}</td>
            <td class="p-3">${ast.assigned}</td>
            <td class="p-3"><span class="text-xs font-bold ${ast.status === 'Available' ? 'text-emerald-600' : 'text-blue-600'}">${ast.status}</span></td>
        </tr>
    `).join("");

    // Tickets
    const tickets = document.getElementById("helpdeskList");
    if (tickets) tickets.innerHTML = DB.tickets.map((t) => `
        <div class="p-3 border rounded-lg dark:border-slate-700 flex justify-between items-center">
            <div>
                <strong class="text-xs">${t.subject}</strong>
                <p class="text-[11px] text-slate-500 mt-1">${t.requester} · ${t.id}</p>
            </div>
            <span class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">${t.priority}</span>
        </div>
    `).join("");

    // Expenses
    const expenses = document.getElementById("expenseTable");
    if (expenses) expenses.innerHTML = DB.expenses.map((e) => `
        <tr class="border-b dark:border-slate-700">
            <td class="p-3">${e.claimant}</td>
            <td class="p-3">${e.category}</td>
            <td class="p-3">$${e.amount}</td>
            <td class="p-3"><span class="text-xs font-bold text-amber-600">${e.status}</span></td>
        </tr>
    `).join("");

    // Kanban Board
    const kanban = document.getElementById("kanbanBoard");
    if (kanban) kanban.innerHTML = ["To Do", "In Progress", "Completed"].map((status) => `
        <div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-xs uppercase text-slate-500 mb-3">${status}</h3>
            <div class="space-y-2">
                ${DB.tasks.filter((t) => t.status === status).map((t) => `
                    <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm text-xs font-medium">${escapeHTML(t.title)}<div class="text-[10px] text-slate-500 mt-1">${escapeHTML(t.assignedTo || "Unassigned")}</div></div>
                `).join("") || '<p class="text-xs text-slate-400">No tasks</p>'}
            </div>
        </div>
    `).join("");

    // Update KPI dashboard numbers
    document.getElementById("kpiTotalUsers").textContent = DB.users.length;
    document.getElementById("kpiPresent").textContent = DB.attendance.filter(a => ["Present", "Late"].includes(a.status)).length;
    document.getElementById("kpiTickets").textContent = DB.tickets.length;
}

// Notice Board Logic
function publishNotice(e) {
    e.preventDefault();
    const title = document.getElementById("noticeTitle").value.trim();
    const message = document.getElementById("noticeMessage").value.trim();
    if (!title || !message) return;

    const announcement = {
        id: Date.now().toString(),
        title,
        message,
        createdAt: new Date().toISOString(),
    };
    DB.announcements.unshift(announcement);
    DB.notifications.unshift({ ...announcement, target: "all", readBy: [], type: "announcement" });
    saveDB();
    e.target.reset();
    renderNoticeBoard();
    renderAdminNotifications();
}

function renderNoticeBoard() {
    const container = document.getElementById("noticeBoardContainer");
    if (!container) return;
    container.innerHTML = DB.announcements.map((item) => `
        <article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white">${escapeHTML(item.title)}</h3>
            <p class="text-xs text-slate-500 mt-1">${escapeHTML(item.message)}</p>
            <span class="text-[10px] text-slate-400 mt-2 block">${new Date(item.createdAt).toLocaleDateString()}</span>
            <button onclick="editAnnouncement('${escapeHTML(item.id)}')" class="text-[10px] text-primary-600 hover:underline mt-2 mr-3">Edit</button>
            <button onclick="deleteAnnouncement('${escapeHTML(item.id)}')" class="text-[10px] text-red-600 hover:underline mt-2">Delete</button>
        </article>
    `).join("") || '<p class="text-sm text-slate-500">No announcements published.</p>';
}

function deleteAnnouncement(id) {
    DB.announcements = DB.announcements.filter((item) => item.id !== id);
    DB.notifications = DB.notifications.filter((item) => item.id !== id);
    saveDB();
    renderNoticeBoard();
    renderAdminNotifications();
}

function editAnnouncement(id) {
    const announcement = DB.announcements.find((item) => item.id === id);
    if (!announcement) return;
    const title = prompt("Announcement title:", announcement.title);
    if (title === null || !title.trim()) return;
    const message = prompt("Announcement details:", announcement.message);
    if (message === null || !message.trim()) return;
    announcement.title = title.trim();
    announcement.message = message.trim();
    const notification = DB.notifications.find((item) => item.id === id);
    if (notification) {
        notification.title = announcement.title;
        notification.message = announcement.message;
    }
    saveDB();
    renderNoticeBoard();
    renderAdminNotifications();
}

function renderAdminNotifications() {
    const list = document.getElementById("adminNotificationList");
    const count = document.getElementById("notifCount");
    if (!list || !count) return;
    const adminEmail = (localStorage.getItem("userEmail") || "admin").toLowerCase();
    const notifications = DB.notifications.filter((item) => item.target === "admin" || item.target === "all" || !item.target);
    const unread = notifications.filter((item) => !(item.readBy || []).includes(adminEmail)).length;
    count.textContent = unread;
    count.classList.toggle("hidden", unread === 0);
    list.innerHTML = notifications.slice(0, 20).map((item) => `
        <article class="p-3 border-b border-slate-100 dark:border-slate-700 ${unread && !(item.readBy || []).includes(adminEmail) ? "bg-primary-50/50 dark:bg-slate-700/30" : ""}">
            <strong class="block text-xs">${escapeHTML(item.title)}</strong>
            <p class="text-[11px] text-slate-500 mt-1">${escapeHTML(item.message)}</p>
            <time class="text-[10px] text-slate-400">${escapeHTML(new Date(item.createdAt).toLocaleString())}</time>
        </article>
    `).join("") || '<p class="p-4 text-xs text-slate-500">No notifications.</p>';
}

function markNotificationsRead() {
    const adminEmail = (localStorage.getItem("userEmail") || "admin").toLowerCase();
    DB.notifications.filter((item) => item.target === "admin" || item.target === "all" || !item.target).forEach((item) => {
        item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
        if (!item.readBy.includes(adminEmail)) item.readBy.push(adminEmail);
    });
    saveDB();
    renderAdminNotifications();
}

function uploadEmployeeDocument(event) {
    event.preventDefault();
    const user = DB.users.find((item) => item.id === document.getElementById("documentEmployee").value && item.role.toLowerCase() === "employee" && item.status !== "Inactive");
    const file = document.getElementById("documentFile").files?.[0];
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    if (!user || !file || !allowedTypes.includes(file.type) || file.size > 1.5 * 1024 * 1024) {
        alert("Select an active employee and a PDF, PNG, JPEG, or text file no larger than 1.5 MB.");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        DB.documents.unshift({
            id: `DOC-${Date.now()}`,
            userId: user.id,
            email: user.email,
            employeeName: user.name,
            name: file.name,
            type: file.type,
            dataUrl: reader.result,
            createdAt: new Date().toISOString(),
        });
        DB.notifications.unshift({ id: `document-${Date.now()}`, target: user.email, title: "HR document shared", message: `${file.name} is available in your documents.`, createdAt: new Date().toISOString(), readBy: [] });
        if (saveDB()) {
            event.target.reset();
            renderDocuments();
            renderAdminNotifications();
        }
    };
    reader.onerror = () => alert("The document could not be read. Try another file.");
    reader.readAsDataURL(file);
}

function renderDocuments() {
    const list = document.getElementById("adminDocumentList");
    if (!list) return;
    list.innerHTML = DB.documents.map((item) => `
        <article class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div><h3 class="text-sm font-bold">${escapeHTML(item.name)}</h3><p class="text-xs text-slate-500">${escapeHTML(item.employeeName)} · ${escapeHTML(item.email)} · ${escapeHTML(item.type)}</p></div>
            <button onclick="deleteEmployeeDocument('${escapeHTML(item.id)}')" class="text-xs text-red-600 hover:underline">Remove</button>
        </article>
    `).join("") || '<p class="text-sm text-slate-500">No employee documents have been shared.</p>';
}

function deleteEmployeeDocument(id) {
    const item = DB.documents.find((documentRecord) => documentRecord.id === id);
    if (!item || !confirm(`Remove ${item.name} from the employee portal?`)) return;
    DB.documents = DB.documents.filter((documentRecord) => documentRecord.id !== id);
    saveDB();
    renderDocuments();
}

// User Actions
function filterDirectory() {
    const query = document.getElementById("directorySearch").value.toLowerCase();
    const rows = document.querySelectorAll("#directoryTableBody tr");
    rows.forEach((r) => {
        r.style.display = r.innerText.toLowerCase().includes(query) ? "" : "none";
    });
}

function deleteUser(id) {
    const user = DB.users.find((entry) => entry.id === id);
    if (!user || user.role.toLowerCase().includes("admin")) {
        alert("Administrator accounts cannot be deactivated from the employee directory.");
        return;
    }
    if (!confirm(`Deactivate ${user.name}? They will no longer be able to sign in.`)) return;
    user.status = "Inactive";
    DB.deletedUserEmails = Array.isArray(DB.deletedUserEmails) ? DB.deletedUserEmails : [];
    if (user.email && !DB.deletedUserEmails.includes(user.email)) DB.deletedUserEmails.push(user.email);
    try {
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers.filter((account) => account.email !== user.email)));
    } catch (error) {
        alert("The account could not be deactivated because browser storage is unavailable.");
        return;
    }
    saveDB();
    renderDirectory();
    renderAdminDataViews();
}

function editUser(id) {
    const user = DB.users.find((entry) => entry.id === id);
    if (!user || user.role.toLowerCase().includes("admin")) return;
    const dept = prompt("Department:", user.dept || "General");
    if (dept === null) return;
    const designation = prompt("Designation:", user.designation || "Employee");
    if (designation === null) return;
    user.dept = dept.trim() || "General";
    user.designation = designation.trim() || "Employee";
    saveDB();
    renderDirectory();
}

function openAddUserModal() {
    const name = prompt("Enter employee name:");
    if (!name || !name.trim()) return;
    const email = (prompt("Employee email:") || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid employee email address.");
        return;
    }
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (registeredUsers.some((account) => account.email === email) || DB.users.some((user) => user.email === email)) {
        alert("That email address is already in use.");
        return;
    }
    const password = prompt("Set a temporary employee password (at least 8 characters):");
    if (!password || password.length < 8) {
        alert("Use a temporary password with at least 8 characters.");
        return;
    }
    const dept = (prompt("Department:", "General") || "General").trim();
    const employee = {
        id: `employee-${Date.now()}`,
        name: name.trim(),
        role: "Employee",
        dept: dept || "General",
        designation: "Employee",
        email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        joiningDate: new Date().toISOString().slice(0, 10),
        status: "Active",
        leaveBalance: 20,
    };
    registeredUsers.push({ name: employee.name, email, role: "employee", password });
    try {
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    } catch (error) {
        alert("The employee account could not be saved. Check available browser storage.");
        return;
    }
    DB.users.push(employee);
    saveDB();
    renderDirectory();
    renderAdminDataViews();
}

function assignTask() {
    const employees = DB.users.filter((user) => user.role.toLowerCase() === "employee" && user.status !== "Inactive");
    if (!employees.length) {
        alert("Add an employee before assigning a task.");
        return;
    }
    const title = (prompt("Task title:") || "").trim();
    if (!title) return;
    const email = (prompt(`Assign to employee email:\n${employees.map((user) => user.email).join("\n")}`) || "").trim().toLowerCase();
    const employee = employees.find((user) => user.email === email);
    if (!employee) {
        alert("Choose an email from the employee directory.");
        return;
    }
    DB.tasks.unshift({ id: `TASK-${Date.now()}`, title, description: "", status: "To Do", priority: "Medium", assignedTo: employee.email, dueDate: "" });
    DB.notifications.unshift({ id: `task-${Date.now()}`, target: employee.email, title: "New task assigned", message: title, createdAt: new Date().toISOString(), readBy: [] });
    saveDB();
    renderAdminDataViews();
}

// Payslip & ID Studio Helpers
function renderPayslipPreview() {
    const name = document.getElementById("payrollUserSelect").value;
    const user = DB.users.find((u) => u.name === name);
    const amount = parseFloat(document.getElementById("payrollAmount").value) || 4500;

    document.getElementById("psName").innerText = name;
    document.getElementById("psRole").innerText = user ? user.role : "Employee";
    document.getElementById("psBase").innerText = `$${amount.toFixed(2)}`;
    document.getElementById("psTotal").innerText = `$${(amount + 150).toFixed(2)}`;
    if (user) {
        DB.payslips.unshift({
            id: `PAY-${Date.now()}`,
            userId: user.id,
            email: user.email,
            name: user.name,
            month: new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" }),
            base: amount,
            allowances: 150,
            deductions: 0,
            net: amount + 150,
            createdAt: new Date().toISOString(),
        });
        saveDB();
    }
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

// Data Export / Import / Reset
function exportJSONData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DB, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EduHR_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importJSONData(e) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            DB = JSON.parse(event.target.result);
            saveDB();
            alert("Database restored!");
            location.reload();
        } catch (err) {
            alert("Invalid JSON format!");
        }
    };
    fileReader.readAsText(e.target.files[0]);
}

function resetSystemData() {
    if (confirm("Reset database to defaults?")) {
        localStorage.removeItem("EDUHR_SYSTEM_DB_V2");
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

// Initialization on Load
window.onload = function () {
    if (DB.settings.darkMode) document.documentElement.classList.add("dark");

    renderDirectory();
    renderAttendance();
    window.setInterval(renderAttendance, 60000);
    renderLeaves();
    renderNoticeBoard();
    renderAdminDataViews();

    const noticeForm = document.getElementById("noticeForm");
    if (noticeForm) noticeForm.addEventListener("submit", publishNotice);
    const documentForm = document.getElementById("employeeDocumentForm");
    if (documentForm) documentForm.addEventListener("submit", uploadEmployeeDocument);

    const adminName = localStorage.getItem("userName");
    if (adminName) document.getElementById("adminUserName").textContent = adminName;
    const adminLogout = document.getElementById("adminLogout");
    if (adminLogout) adminLogout.addEventListener("click", () => {
        ["userRole", "userEmail", "userName", "isLoggedIn"].forEach((key) => localStorage.removeItem(key));
        window.location.href = "../signin.html";
    });
    document.getElementById("notifBtn").addEventListener("click", () => document.getElementById("adminNotifications").classList.toggle("hidden"));
    document.getElementById("markNotificationsRead").addEventListener("click", markNotificationsRead);
    renderAdminNotifications();
    renderDocuments();

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const setSidebarOpen = (isOpen) => {
        sidebar.classList.toggle("-translate-x-full", !isOpen);
        sidebarOverlay.classList.toggle("hidden", !isOpen);
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
        sidebarToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        document.body.classList.toggle("overflow-hidden", isOpen);
    };

    sidebarToggle.addEventListener("click", () => {
        setSidebarOpen(sidebar.classList.contains("-translate-x-full"));
    });
    sidebarOverlay.addEventListener("click", () => setSidebarOpen(false));
    sidebar.querySelectorAll(".nav-btn").forEach((button) => button.addEventListener("click", () => setSidebarOpen(false)));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setSidebarOpen(false);
    });

    document.getElementById("themeToggle").addEventListener("click", toggleDarkMode);

    switchView("v1");

    // Initialize Chart.js Analytics
    const ctx1 = document.getElementById("adminAttendanceChart");
    if (ctx1) {
        new Chart(ctx1.getContext("2d"), {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                datasets: [{
                    label: "Attendance %",
                    data: [92, 95, 94, 96, 91],
                    borderColor: "#0284c7",
                    backgroundColor: "rgba(2, 132, 199, 0.1)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const ctx2 = document.getElementById("adminDeptChart");
    if (ctx2) {
        new Chart(ctx2.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Executive", "Engineering", "HR", "Support"],
                datasets: [{
                    data: [10, 45, 15, 30],
                    backgroundColor: ["#0284c7", "#10b981", "#f59e0b", "#6366f1"]
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key !== "EDUHR_SYSTEM_DB_V2" || !event.newValue) return;
        try {
            DB = JSON.parse(event.newValue);
            renderDirectory();
            renderAttendance();
            renderLeaves();
            renderNoticeBoard();
            renderAdminDataViews();
            renderAdminNotifications();
            renderDocuments();
        } catch (error) {
            alert("Shared HR data could not be refreshed because it is invalid.");
        }
    });
};