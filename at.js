// Global Variables
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
const employeeForm = document.getElementById('employeeForm');
const attendanceList = document.getElementById('attendanceList');
const attendanceModal = document.getElementById('attendanceModal');
const attendanceDate = document.getElementById('attendanceDate');
const statusSelect = document.getElementById('status');
const closeModal = document.getElementById('closeModal');
const exportBtn = document.getElementById('exportBtn');
let currentEmployeeId;

// Event Listeners
employeeForm.addEventListener('submit', addEmployee);
closeModal.addEventListener('click', () => {
    attendanceModal.style.display = 'none';
});
exportBtn.addEventListener('click', exportToCSV);

// Add Employee
function addEmployee(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const employee = {
        id: Date.now(),
        name,
        attendance: []
    };

    attendanceData.push(employee);
    saveToLocalStorage();
    renderAttendanceList();

    // Clear form inputs
    employeeForm.reset();
}

// Open Attendance Modal
function openAttendanceModal(employeeId) {
    currentEmployeeId = employeeId;
    attendanceModal.style.display = 'block';
}

// Mark Attendance
document.getElementById('attendanceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const date = attendanceDate.value;
    const status = statusSelect.value;

    const attendanceRecord = {
        date,
        status
    };

    const employee = attendanceData.find(emp => emp.id === currentEmployeeId);
    employee.attendance.push(attendanceRecord);
    saveToLocalStorage();
    renderAttendanceList();

    attendanceModal.style.display = 'none';
});

// Render Attendance List
function renderAttendanceList() {
    attendanceList.innerHTML = '';
    attendanceData.forEach((emp, index) => {
        emp.attendance.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${emp.name}</td>
                <td>${record.date}</td>
                <td>${record.status}</td>
                <td class="actions">
                    <button class="action-btn edit-btn" onclick="openAttendanceModal(${emp.id})">Mark Attendance</button>
                    <button class="action-btn delete-btn" onclick="deleteAttendance(${emp.id}, '${record.date}')">Delete</button>
                </td>
            `;
            attendanceList.appendChild(row);
        });
    });
    renderStatistics();
}

// Delete Attendance Record
function deleteAttendance(employeeId, date) {
    const employee = attendanceData.find(emp => emp.id === employeeId);
    employee.attendance = employee.attendance.filter(record => record.date !== date);
    saveToLocalStorage();
    renderAttendanceList();
}

// Search Employee
function searchEmployee() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    attendanceList.innerHTML = '';

    attendanceData.forEach((emp, index) => {
        emp.attendance.forEach(record => {
            if (emp.name.toLowerCase().includes(query)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${emp.name}</td>
                    <td>${record.date}</td>
                    <td>${record.status}</td>
                    <td class="actions">
                        <button class="action-btn edit-btn" onclick="openAttendanceModal(${emp.id})">Mark Attendance</button>
                        <button class="action-btn delete-btn" onclick="deleteAttendance(${emp.id}, '${record.date}')">Delete</button>
                    </td>
                `;
                attendanceList.appendChild(row);
            }
        });
    });
}

// Export to CSV
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee Name,Date,Attendance\n";

    attendanceData.forEach(emp => {
        emp.attendance.forEach(record => {
            const row = `${emp.name},${record.date},${record.status}`;
            csvContent += row + "\n";
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

// Render Statistics
function renderStatistics() {
    const statsList = document.getElementById('statsList');
    statsList.innerHTML = '';

    attendanceData.forEach(emp => {
        const presentDays = emp.attendance.filter(record => record.status === 'Present').length;
        const absentDays = emp.attendance.filter(record => record.status === 'Absent').length;

        const statItem = document.createElement('li');
        statItem.innerHTML = `<strong>${emp.name}:</strong> Present - ${presentDays}, Absent - ${absentDays}`;
        statsList.appendChild(statItem);
    });
}

// Initialize the app
function init() {
    renderAttendanceList();
}

init();
