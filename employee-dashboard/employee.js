const DB_KEY = "EDUHR_SYSTEM_DB_V2";
const activeEmail = (localStorage.getItem("userEmail") || "").toLowerCase();
const employeeName = localStorage.getItem("userName") || "Employee";

function readDatabase() {
	try {
		const database = JSON.parse(localStorage.getItem(DB_KEY) || "{}");
		return database && typeof database === "object" ? database : {};
	} catch (error) {
		return {};
	}
}

let DB = readDatabase();
const ensureCollection = (key) => {
	if (!Array.isArray(DB[key])) DB[key] = [];
	return DB[key];
};
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
	"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));
const employee = (ensureCollection("users").find((user) => user.email?.toLowerCase() === activeEmail)) || {
	id: `account-${activeEmail}`,
	name: employeeName,
	role: "Employee",
	email: activeEmail,
	dept: "General",
	designation: "Employee",
	status: "Active",
};

function saveDatabase() {
	try {
		localStorage.setItem(DB_KEY, JSON.stringify(DB));
		return true;
	} catch (error) {
		window.alert("Your change could not be saved. Check available browser storage and try again.");
		return false;
	}
}

function addNotification(target, title, message) {
	ensureCollection("notifications").unshift({
		id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		target,
		title,
		message,
		createdAt: new Date().toISOString(),
		readBy: [],
	});
}

function isMine(record) {
	return record.email?.toLowerCase() === activeEmail || (!record.email && record.name === employee.name);
}

function localDateKey(date = new Date()) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function timeLabel(date) {
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function elapsedTime(record, now = new Date()) {
	const startedAt = record.checkInAt ? new Date(record.checkInAt) : null;
	if (!startedAt || Number.isNaN(startedAt.getTime())) return record.hours ? `${Number(record.hours).toFixed(2)} hours` : "0h 0m";
	const endedAt = record.checkOutAt ? new Date(record.checkOutAt) : record.out ? new Date(`${record.date}T${record.out}`) : now;
	const elapsedMinutes = Math.max(0, Math.floor((endedAt - startedAt) / 60000));
	return `${Math.floor(elapsedMinutes / 60)}h ${elapsedMinutes % 60}m`;
}

function isLateCheckIn(date) {
	return date.getHours() > 10 || (date.getHours() === 10 && date.getMinutes() > 30);
}

function dateLabel(value) {
	if (!value) return "Not set";
	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function getEmployeeLeaves() {
	return ensureCollection("leaves").filter(isMine);
}

function getAttendance() {
	return ensureCollection("attendance").filter(isMine).sort((first, second) => second.date.localeCompare(first.date));
}

function renderDashboard() {
	const attendance = getAttendance();
	const leaves = getEmployeeLeaves();
	const announcements = ensureCollection("announcements").slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	const notifications = ensureCollection("notifications").filter((item) => item.target === activeEmail || item.target === "employee" || item.target === "all");
	const unread = notifications.filter((item) => !(item.readBy || []).includes(activeEmail)).length;
	const approvedDays = leaves.filter((leave) => leave.status === "Approved").reduce((total, leave) => total + leaveDays(leave), 0);
	const leaveBalance = Math.max(0, Number(employee.leaveBalance ?? 20) - approvedDays);

	document.getElementById("dash-user-name").textContent = employee.name || employeeName;
	document.getElementById("welcome-user-name").textContent = employee.name || employeeName;
	document.getElementById("employee-designation").textContent = employee.designation || "Employee";
	document.getElementById("employee-department").textContent = employee.dept || "General";
	document.getElementById("employee-present-days").textContent = attendance.filter((record) => ["Present", "Late"].includes(record.status)).length;
	document.getElementById("employee-leave-balance").textContent = `${leaveBalance} days`;
	document.getElementById("employee-leave-count").textContent = leaves.filter((leave) => leave.status === "Pending").length;
	document.getElementById("employee-unread-count").textContent = unread;
	document.getElementById("sidebar-notification-count").textContent = unread;
	document.getElementById("sidebar-notification-count").classList.toggle("hidden", unread === 0);
	document.getElementById("employee-notification-dot").classList.toggle("hidden", unread === 0);

	const recentAttendance = attendance.slice(0, 5);
	document.getElementById("employee-attendance-list").innerHTML = recentAttendance.map((record) => `
		<tr><td>${escapeHTML(dateLabel(record.date))}</td><td>${escapeHTML(record.in || "-")}</td><td>${escapeHTML(record.out || "-")}</td><td><span class="status-badge ${record.status === "Present" || record.status === "Late" ? "status-active" : "status-pending"}">${escapeHTML(record.status || "Present")}</span></td></tr>
	`).join("") || '<tr><td colspan="4" class="employee-empty">No attendance records yet.</td></tr>';

	renderAttendance(attendance);
	renderLeaves(leaves);
	renderProfile();
	renderAnnouncements(announcements);
	renderTasks();
	renderDocuments();
	renderPayslips();
	renderNotifications(notifications);
}

function leaveDays(leave) {
	if (leave.startDate && leave.endDate) {
		const start = new Date(`${leave.startDate}T00:00:00`);
		const end = new Date(`${leave.endDate}T00:00:00`);
		return Math.max(0, Math.floor((end - start) / 86400000) + 1);
	}
	return 0;
}

function renderAttendance(attendance = getAttendance()) {
	const monthFilter = document.getElementById("employee-attendance-filter").value;
	const todayKey = localDateKey();
	const todayRecord = attendance.find((record) => record.date === todayKey);
	const status = document.getElementById("employee-attendance-today-status");
	const checkIn = document.getElementById("employee-check-in");
	const checkOut = document.getElementById("employee-check-out");
	document.getElementById("employee-live-clock").textContent = `Current time: ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
	if (todayRecord) {
		status.textContent = todayRecord.out ? `Checked in at ${todayRecord.in}; checked out at ${todayRecord.out}.${todayRecord.status === "Late" ? " Late arrival." : ""}` : `Checked in at ${todayRecord.in}. Your shift is in progress.${todayRecord.status === "Late" ? " Late arrival (after 10:30 AM)." : ""}`;
	} else {
		status.textContent = "No attendance recorded yet.";
	}
	document.getElementById("employee-worked-time").textContent = `Worked today: ${todayRecord ? elapsedTime(todayRecord) : "0h 0m"}`;
	checkIn.disabled = Boolean(todayRecord);
	checkOut.disabled = !todayRecord || Boolean(todayRecord.out);
	const filteredAttendance = attendance.filter((record) => !monthFilter || record.date.startsWith(monthFilter));
	document.getElementById("employee-attendance-history").innerHTML = filteredAttendance.map((record) => `
		<tr><td>${escapeHTML(dateLabel(record.date))}</td><td>${escapeHTML(record.in || "-")}</td><td>${escapeHTML(record.out || "-")}</td><td>${escapeHTML(record.checkInAt ? elapsedTime(record) : record.hours || "-")}</td><td><span class="status-badge ${record.status === "Present" || record.status === "Late" ? "status-active" : "status-pending"}">${escapeHTML(record.status || "Present")}</span></td></tr>
	`).join("") || '<tr><td colspan="5" class="employee-empty">No attendance records for this period.</td></tr>';
}

function checkIn() {
	const attendance = ensureCollection("attendance");
	const date = localDateKey();
	if (attendance.some((record) => isMine(record) && record.date === date)) return;
	const now = new Date();
	attendance.unshift({ id: `attendance-${activeEmail}-${date}`, userId: employee.id, email: activeEmail, name: employee.name, date, in: timeLabel(now), out: "", checkInAt: now.toISOString(), status: isLateCheckIn(now) ? "Late" : "Present" });
	addNotification(activeEmail, "Attendance checked in", `You checked in at ${timeLabel(now)}.`);
	if (saveDatabase()) renderDashboard();
}

function checkOut() {
	const record = ensureCollection("attendance").find((item) => isMine(item) && item.date === localDateKey());
	if (!record || record.out) return;
	const now = new Date();
	record.out = timeLabel(now);
	record.checkOutAt = now.toISOString();
	const startedAt = new Date(record.checkInAt || now);
	record.hours = Math.max(0, (now - startedAt) / 3600000).toFixed(2);
	addNotification(activeEmail, "Attendance checked out", `You worked ${record.hours} hours today.`);
	if (saveDatabase()) renderDashboard();
}

function renderLeaves(leaves = getEmployeeLeaves()) {
	const filter = document.getElementById("employee-leave-filter").value;
	const filteredLeaves = leaves.filter((leave) => filter === "all" || leave.status === filter);
	document.getElementById("employee-leave-list").innerHTML = filteredLeaves.map((leave) => `
		<tr><td>${escapeHTML(leave.dates || `${dateLabel(leave.startDate)} - ${dateLabel(leave.endDate)}`)}</td><td>${escapeHTML(leave.type)}</td><td>${escapeHTML(leave.reason)}</td><td><span class="status-badge ${leave.status === "Approved" ? "status-active" : "status-pending"}">${escapeHTML(leave.status)}</span></td><td>${leave.status === "Pending" ? `<button class="btn-action" onclick="editLeave('${escapeHTML(leave.id)}')">Edit</button> <button class="btn-action" onclick="cancelLeave('${escapeHTML(leave.id)}')">Cancel</button>` : ""}</td></tr>
	`).join("") || '<tr><td colspan="5" class="employee-empty">No leave requests found.</td></tr>';
}

function applyForLeave(event) {
	event.preventDefault();
	const startDate = document.getElementById("employee-leave-start").value;
	const endDate = document.getElementById("employee-leave-end").value;
	const reason = document.getElementById("employee-leave-reason").value.trim();
	if (!startDate || !endDate || endDate < startDate || startDate < localDateKey()) {
		window.alert("Choose valid leave dates today or later, with the end date on or after the start date.");
		return;
	}
	const overlap = getEmployeeLeaves().some((leave) => leave.status !== "Rejected" && startDate <= leave.endDate && endDate >= leave.startDate);
	if (overlap) {
		window.alert("These dates overlap an existing leave request.");
		return;
	}
	const request = {
		id: `leave-${activeEmail}-${Date.now()}`,
		userId: employee.id,
		email: activeEmail,
		name: employee.name,
		type: document.getElementById("employee-leave-type").value,
		startDate,
		endDate,
		dates: `${dateLabel(startDate)} - ${dateLabel(endDate)}`,
		reason,
		status: "Pending",
		createdAt: new Date().toISOString(),
	};
	ensureCollection("leaves").unshift(request);
	addNotification("admin", "New leave request", `${employee.name} requested ${request.type} from ${dateLabel(startDate)} to ${dateLabel(endDate)}.`);
	addNotification(activeEmail, "Leave request submitted", `Your ${request.type} request is pending HR review.`);
	if (saveDatabase()) {
		event.target.reset();
		renderDashboard();
		window.alert("Your leave request was sent to HR for review.");
	}
}

function cancelLeave(id) {
	const leave = getEmployeeLeaves().find((item) => item.id === id && item.status === "Pending");
	if (!leave || !window.confirm("Cancel this pending leave request?")) return;
	DB.leaves = DB.leaves.filter((item) => item.id !== id);
	if (saveDatabase()) renderDashboard();
}

function editLeave(id) {
	const leave = getEmployeeLeaves().find((item) => item.id === id && item.status === "Pending");
	if (!leave) return;
	const type = window.prompt("Leave type:", leave.type || "Casual Leave");
	if (type === null || !type.trim()) return;
	const startDate = window.prompt("Start date (YYYY-MM-DD):", leave.startDate || "");
	if (startDate === null) return;
	const endDate = window.prompt("End date (YYYY-MM-DD):", leave.endDate || "");
	if (endDate === null) return;
	const reason = window.prompt("Reason:", leave.reason || "");
	if (reason === null || !reason.trim()) return;
	if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(startDate) || !/^\\d{4}-\\d{2}-\\d{2}$/.test(endDate) || endDate < startDate || startDate < localDateKey()) {
		window.alert("Enter valid leave dates today or later, with the end date on or after the start date.");
		return;
	}
	const overlap = getEmployeeLeaves().some((item) => item.id !== id && item.status !== "Rejected" && startDate <= item.endDate && endDate >= item.startDate);
	if (overlap) {
		window.alert("These dates overlap another leave request.");
		return;
	}
	Object.assign(leave, { type: type.trim(), startDate, endDate, dates: `${dateLabel(startDate)} - ${dateLabel(endDate)}`, reason: reason.trim() });
	addNotification("admin", "Leave request updated", `${employee.name} updated a pending leave request.`);
	if (saveDatabase()) renderDashboard();
}

function renderProfile() {
	document.getElementById("employee-profile-avatar").src = employee.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80";
	document.getElementById("employee-profile-name").textContent = employee.name || employeeName;
	document.getElementById("employee-profile-role").textContent = employee.designation || "Employee";
	const facts = [
		["Employee ID", employee.employeeId || employee.id],
		["Email", employee.email],
		["Department", employee.dept || "General"],
		["Designation", employee.designation || "Employee"],
		["Joining date", dateLabel(employee.joiningDate)],
	];
	document.getElementById("employee-profile-facts").innerHTML = facts.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value || "Not provided")}</strong></div>`).join("");
	document.getElementById("employee-phone").value = employee.phone || "";
	document.getElementById("employee-address").value = employee.address || "";
	document.getElementById("employee-emergency-contact").value = employee.emergencyContact || "";
}

function saveProfile(event) {
	event.preventDefault();
	employee.phone = document.getElementById("employee-phone").value.trim();
	employee.address = document.getElementById("employee-address").value.trim();
	employee.emergencyContact = document.getElementById("employee-emergency-contact").value.trim();
	if (saveDatabase()) window.alert("Your contact details were saved.");
}

function renderAnnouncements(announcements) {
	const cards = announcements.map((item) => `<article class="employee-feed-item"><span class="employee-eyebrow">${escapeHTML(dateLabel((item.createdAt || "").slice(0, 10)))}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.message)}</p></article>`).join("") || '<p class="employee-empty">There are no announcements yet.</p>';
	document.getElementById("employee-announcement-list").innerHTML = cards;
	document.getElementById("employee-announcement-preview").innerHTML = announcements.slice(0, 3).map((item) => `<article class="employee-feed-item"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.message)}</p></article>`).join("") || '<p class="employee-empty">No recent announcements.</p>';
}

function renderTasks() {
	const tasks = ensureCollection("tasks").filter((task) => task.assignedTo?.toLowerCase() === activeEmail || task.assigneeEmail?.toLowerCase() === activeEmail);
	document.getElementById("employee-task-list").innerHTML = tasks.map((task) => `
		<article class="employee-task"><div><span class="task-tag ${task.priority === "High" ? "tag-high" : task.priority === "Low" ? "tag-low" : "tag-med"}">${escapeHTML(task.priority || "Normal")}</span><h3>${escapeHTML(task.title)}</h3><p>${escapeHTML(task.description || "No additional details.")}</p><small>${task.dueDate ? `Due ${escapeHTML(dateLabel(task.dueDate))}` : "No deadline"}</small></div><select class="form-select employee-task-status" aria-label="Task status" onchange="updateTaskStatus('${escapeHTML(task.id)}', this.value)"><option ${task.status === "To Do" ? "selected" : ""}>To Do</option><option ${task.status === "In Progress" ? "selected" : ""}>In Progress</option><option ${task.status === "Completed" ? "selected" : ""}>Completed</option></select></article>
	`).join("") || '<p class="employee-empty">No tasks have been assigned to you.</p>';
}

function updateTaskStatus(id, status) {
	const task = ensureCollection("tasks").find((item) => item.id === id && (item.assignedTo?.toLowerCase() === activeEmail || item.assigneeEmail?.toLowerCase() === activeEmail));
	if (!task) return;
	task.status = status;
	saveDatabase();
}

function renderDocuments() {
	const documents = ensureCollection("documents").filter((item) => item.email?.toLowerCase() === activeEmail || item.userId === employee.id);
	document.getElementById("employee-document-list").innerHTML = documents.map((item) => `
		<article class="employee-payslip"><div><span class="employee-eyebrow">${escapeHTML(item.type || "HR DOCUMENT")}</span><h3>${escapeHTML(item.name)}</h3><p>Shared ${escapeHTML(dateLabel((item.createdAt || "").slice(0, 10)))}</p></div><a class="btn-action" href="${escapeHTML(item.dataUrl)}" download="${escapeHTML(item.name)}"><i class="fa-solid fa-download"></i> Download</a></article>
	`).join("") || '<p class="employee-empty">No documents have been shared with you.</p>';
}

function renderPayslips() {
	const payslips = ensureCollection("payslips").filter((payslip) => payslip.email?.toLowerCase() === activeEmail);
	document.getElementById("employee-payslip-list").innerHTML = payslips.map((payslip) => `
		<article class="employee-payslip"><div><span class="employee-eyebrow">${escapeHTML(payslip.month || "Payslip")}</span><h3>Net pay $${Number(payslip.net || 0).toFixed(2)}</h3><p>Base $${Number(payslip.base || 0).toFixed(2)} · Allowances $${Number(payslip.allowances || 0).toFixed(2)} · Deductions $${Number(payslip.deductions || 0).toFixed(2)}</p></div><button class="btn-action" onclick="printPayslip('${escapeHTML(payslip.id)}')"><i class="fa-solid fa-print"></i> Print</button></article>
	`).join("") || '<p class="employee-empty">No payslips have been published for your account.</p>';
}

function printPayslip(id) {
	const payslip = ensureCollection("payslips").find((item) => item.id === id && item.email?.toLowerCase() === activeEmail);
	if (!payslip) return;
	const printWindow = window.open("", "_blank", "noopener,noreferrer,width=720,height=800");
	if (!printWindow) {
		window.alert("Allow pop-ups to print your payslip.");
		return;
	}
	printWindow.document.write(`<title>EduHR Payslip</title><style>body{font:16px Arial,sans-serif;max-width:640px;margin:50px auto;color:#18332d}h1{font-size:24px}hr{border:0;border-top:1px solid #ddd;margin:24px 0}.row{display:flex;justify-content:space-between;margin:12px 0}.total{font-size:20px;font-weight:bold}</style><h1>EduHR Payslip</h1><p>${escapeHTML(payslip.month)}</p><p>${escapeHTML(employee.name)} · ${escapeHTML(employee.email)}</p><hr><div class="row"><span>Base salary</span><span>$${Number(payslip.base || 0).toFixed(2)}</span></div><div class="row"><span>Allowances</span><span>$${Number(payslip.allowances || 0).toFixed(2)}</span></div><div class="row"><span>Deductions</span><span>-$${Number(payslip.deductions || 0).toFixed(2)}</span></div><hr><div class="row total"><span>Net pay</span><span>$${Number(payslip.net || 0).toFixed(2)}</span></div>`);
	printWindow.document.close();
	printWindow.print();
}

function renderNotifications(notifications) {
	document.getElementById("employee-notification-list").innerHTML = notifications.map((item) => {
		const isRead = (item.readBy || []).includes(activeEmail);
		return `<article class="employee-feed-item ${isRead ? "" : "employee-unread"}"><span class="employee-eyebrow">${escapeHTML(dateLabel((item.createdAt || "").slice(0, 10)))}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.message)}</p></article>`;
	}).join("") || '<p class="employee-empty">You are all caught up.</p>';
}

function markNotificationsRead() {
	ensureCollection("notifications").filter((item) => item.target === activeEmail || item.target === "employee" || item.target === "all").forEach((item) => {
		item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
		if (!item.readBy.includes(activeEmail)) item.readBy.push(activeEmail);
	});
	if (saveDatabase()) renderDashboard();
}

function switchSection(section) {
	if (!document.getElementById(section)) return;
	document.querySelectorAll(".employee-section").forEach((panel) => panel.classList.toggle("hidden", panel.id !== section));
	document.querySelectorAll(".sidebar-link").forEach((link) => link.classList.toggle("active", link.dataset.section === section));
	document.getElementById("portal-page-title").textContent = document.querySelector(`.sidebar-link[data-section="${section}"] span`)?.textContent || "Employee Portal";
	history.replaceState(null, "", `#${section}`);
	setSidebarOpen(false);
}

function setSidebarOpen(isOpen) {
	const sidebar = document.getElementById("dashboard-sidebar");
	const overlay = document.getElementById("sidebar-overlay");
	const toggle = document.getElementById("mobile-sidebar-toggle");
	if (!sidebar || !overlay) return;
	sidebar.classList.toggle("open", isOpen);
	overlay.classList.toggle("hidden", !isOpen);
	document.body.classList.toggle("sidebar-open", isOpen);
	toggle?.setAttribute("aria-expanded", String(isOpen));
	toggle?.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
	const icon = toggle?.querySelector("i");
	icon?.classList.toggle("fa-bars", !isOpen);
	icon?.classList.toggle("fa-xmark", isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-section]").forEach((link) => link.addEventListener("click", (event) => {
		event.preventDefault();
		switchSection(link.dataset.section);
	}));
	document.getElementById("mobile-sidebar-toggle").addEventListener("click", () => {
		const isOpen = document.getElementById("dashboard-sidebar").classList.contains("open");
		setSidebarOpen(!isOpen);
	});
	document.getElementById("close-sidebar-btn").addEventListener("click", () => setSidebarOpen(false));
	document.getElementById("sidebar-overlay").addEventListener("click", () => setSidebarOpen(false));
	document.getElementById("employee-check-in").addEventListener("click", checkIn);
	document.getElementById("employee-check-out").addEventListener("click", checkOut);
	document.getElementById("employee-attendance-filter").addEventListener("change", () => renderAttendance());
	document.getElementById("employee-leave-filter").addEventListener("change", () => renderLeaves());
	document.getElementById("employee-leave-form").addEventListener("submit", applyForLeave);
	document.getElementById("employee-profile-form").addEventListener("submit", saveProfile);
	document.getElementById("employee-mark-read").addEventListener("click", markNotificationsRead);
	document.getElementById("employee-notification-button").addEventListener("click", () => switchSection("notifications"));
	document.getElementById("employee-leave-start").min = localDateKey();
	document.getElementById("employee-leave-end").min = localDateKey();
	document.getElementById("employee-leave-start").addEventListener("change", (event) => {
		document.getElementById("employee-leave-end").min = event.target.value || localDateKey();
	});
	window.setInterval(() => renderAttendance(), 1000);
	renderDashboard();
	switchSection(location.hash.slice(1) || "overview");
	window.addEventListener("storage", (event) => {
		if (event.key === DB_KEY) {
			DB = readDatabase();
			renderDashboard();
		}
	});
});
