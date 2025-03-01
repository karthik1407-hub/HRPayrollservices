// Global Variables
let employeeData = JSON.parse(localStorage.getItem('employeeData')) || [];
const employeeForm = document.getElementById('employeeForm');
const payrollList = document.getElementById('payrollList');
const searchInput = document.getElementById('search');
const exportBtn = document.getElementById('exportBtn');
const filterBtn = document.getElementById('filterBtn');
const employeeModal = document.getElementById('employeeModal');
const employeeDetails = document.getElementById('employeeDetails');
const closeModal = document.getElementById('closeModal');
const editModalBtn = document.getElementById('editModalBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const darkModeToggle = document.getElementById('darkMode');
const salaryChartCanvas = document.getElementById('salaryChart');
let currentPage = 1;
const recordsPerPage = 5;
let sortField = 'id';
let sortOrder = 'asc';

// Event Listeners
employeeForm.addEventListener('submit', addEmployee);
searchInput.addEventListener('input', renderPayrollList);
filterBtn.addEventListener('click', filterBySalary);
exportBtn.addEventListener('click', exportToCSV);
closeModal.addEventListener('click', () => {
    employeeModal.style.display = 'none';
});
editModalBtn.addEventListener('click', () => {
    const employee = JSON.parse(employeeDetails.dataset.employee);
    document.getElementById('name').value = employee.name;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('workingDays').value = employee.workingDays;
    deleteEmployee(employee.id);
    employeeModal.style.display = 'none';
});

// Dark Mode Toggle
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Add Employee
function addEmployee(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const salary = parseFloat(document.getElementById('salary').value);
    const workingDays = parseInt(document.getElementById('workingDays').value);
    const formError = document.getElementById('formError');
    formError.textContent = ''; // Clear previous error message

    // Validate input
    if (salary <= 0 || workingDays <= 0 || workingDays > 31) {
        formError.textContent = 'Please enter valid salary and working days!';
        return;
    }

    const netSalary = calculateNetSalary(salary, workingDays);
    const employee = {
        id: Date.now(),
        name,
        salary,
        workingDays,
        netSalary
    };

    employeeData.push(employee);
    saveToLocalStorage();
    renderPayrollList();

    // Clear form inputs
    employeeForm.reset();
}

// Calculate Net Salary
function calculateNetSalary(salary, workingDays) {
    return (salary / 30) * workingDays; // Assuming 30 days in a month
}

// Render Payroll List
function renderPayrollList() {
    showLoadingSpinner();
    const filteredData = getFilteredData();
    const sortedData = sortData(filteredData);

    const totalPages = Math.ceil(sortedData.length / recordsPerPage);
    currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Ensure current page is valid

    const startIndex = (currentPage - 1) * recordsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + recordsPerPage);

    payrollList.innerHTML = '';
    paginatedData.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td onclick="showEmployeeDetails(${emp.id})" class="clickable">${emp.name}</td>
            <td>${emp.salary.toFixed(2)}</td>
            <td>${emp.workingDays}</td>
            <td>${emp.netSalary.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee(${emp.id})" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="confirmDelete(${emp.id})" title="Delete">🗑️</button>
            </td>
        `;
        payrollList.appendChild(row);
    });

    renderPagination(totalPages);
    hideLoadingSpinner();
    renderSalaryChart(); // Render salary chart when updating the list
}

// Show Employee Details in Modal
function showEmployeeDetails(id) {
    const employee = employeeData.find(emp => emp.id === id);
    employeeDetails.dataset.employee = JSON.stringify(employee);
    employeeDetails.innerHTML = `
        <p><strong>Name:</strong> ${employee.name}</p>
        <p><strong>Monthly Salary:</strong> ${employee.salary.toFixed(2)}</p>
        <p><strong>Working Days:</strong> ${employee.workingDays}</p>
        <p><strong>Net Salary:</strong> ${employee.netSalary.toFixed(2)}</p>
    `;
    employeeModal.style.display = 'block';
}

// Show Loading Spinner
function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

// Sort Data
function sortData(data) {
    return data.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
}

// Sort Table
function sortTable(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'asc';
    }
    renderPayrollList();
}

// Confirm Delete
function confirmDelete(id) {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (confirmed) {
        deleteEmployee(id);
    }
}

// Delete Employee
function deleteEmployee(id) {
    employeeData = employeeData.filter(emp => emp.id !== id);
    saveToLocalStorage();
    renderPayrollList();
}

// Edit Employee
function editEmployee(id) {
    const employee = employeeData.find(emp => emp.id === id);
    document.getElementById('name').value = employee.name;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('workingDays').value = employee.workingDays;
    deleteEmployee(id);
}

// Filter by Salary
function filterBySalary() {
    const salaryThreshold = prompt("Enter a salary threshold to filter employees:");
    if (salaryThreshold !== null) {
        const filteredData = employeeData.filter(emp => emp.salary > parseFloat(salaryThreshold));
        renderFilteredData(filteredData);
    }
}

// Render Filtered Data
function renderFilteredData(data) {
    payrollList.innerHTML = '';
    data.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td onclick="showEmployeeDetails(${emp.id})" class="clickable">${emp.name}</td>
            <td>${emp.salary.toFixed(2)}</td>
            <td>${emp.workingDays}</td>
            <td>${emp.netSalary.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee(${emp.id})" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="confirmDelete(${emp.id})" title="Delete">🗑️</button>
            </td>
        `;
        payrollList.appendChild(row);
    });
}

// Get Filtered Data
function getFilteredData() {
    const searchTerm = searchInput.value.toLowerCase();
    return employeeData.filter(emp => emp.name.toLowerCase().includes(searchTerm));
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
}

// Export to CSV
function exportToCSV() {
    const csvRows = [];
    const headers = ['ID', 'Name', 'Monthly Salary', 'Working Days', 'Net Salary'];
    csvRows.push(headers.join(','));

    employeeData.forEach(emp => {
        const row = [
            emp.id,
            emp.name,
            emp.salary.toFixed(2),
            emp.workingDays,
            emp.netSalary.toFixed(2)
        ];
        csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'employees.csv');
    a.click();
}

// Render Pagination
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'page-button';
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPayrollList();
        });
        pagination.appendChild(pageButton);
    }
}

// Render Salary Chart
function renderSalaryChart() {
    const salaryData = employeeData.map(emp => emp.netSalary);
    const names = employeeData.map(emp => emp.name);

    const ctx = salaryChartCanvas.getContext('2d');
    const salaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: names,
            datasets: [{
                label: 'Net Salary Distribution',
                data: salaryData,
                backgroundColor: [
                    'rgba(66, 133, 244, 0.6)',
                    'rgba(219, 68, 55, 0.6)',
                    'rgba(244, 180, 0, 0.6)',
                    'rgba(15, 157, 88, 0.6)',
                    'rgba(191, 90, 242, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Salary Distribution'
                }
            }
        }
    });
}

// Initialize the app
function init() {
    renderPayrollList();
}

init();
