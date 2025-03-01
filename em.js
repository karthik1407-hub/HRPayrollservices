document.addEventListener('DOMContentLoaded', function () {
    loadEmployeesFromStorage();
    updateAnalytics();
});

// Feature 1: Sorting by columns
let currentSort = { column: null, order: 'asc' };
function sortTable(column) {
    const employeeList = getEmployeesFromStorage();
    const sortOrder = currentSort.column === column && currentSort.order === 'asc' ? 'desc' : 'asc';
    
    employeeList.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[column] > b[column] ? 1 : -1;
        } else {
            return a[column] < b[column] ? 1 : -1;
        }
    });

    currentSort = { column, order: sortOrder };
    renderEmployeeTable(employeeList);
}

// Feature 2: Pagination
let currentPage = 1;
const rowsPerPage = 5;
function renderEmployeeTable(employeeList) {
    const employeeTable = document.getElementById('employeeList');
    employeeTable.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedEmployees = employeeList.slice(startIndex, startIndex + rowsPerPage);

    paginatedEmployees.forEach((employee, index) => {
        const row = employeeTable.insertRow();
        row.insertCell(0).innerText = startIndex + index + 1;
        row.insertCell(1).innerText = employee.firstName;
        row.insertCell(2).innerText = employee.lastName;
        row.insertCell(3).innerText = employee.email;
        row.insertCell(4).innerText = employee.phone;
        row.insertCell(5).innerText = employee.department;
        row.insertCell(6).innerText = employee.salary;
        row.insertCell(7).innerHTML = `
            <button class="edit" onclick="editEmployee(${index})">Edit</button>
            <button class="delete" onclick="deleteEmployee(${index})">Delete</button>
        `;
    });

    updatePagination(employeeList);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderEmployeeTable(getEmployeesFromStorage());
    }
}

function nextPage() {
    const employeeList = getEmployeesFromStorage();
    if (currentPage * rowsPerPage < employeeList.length) {
        currentPage++;
        renderEmployeeTable(employeeList);
    }
}

function updatePagination(employeeList) {
    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage * rowsPerPage >= employeeList.length;
}

// Feature 3: Salary Range Filter
function filterBySalary() {
    const salaryRange = document.getElementById('salaryRange').value;
    document.getElementById('salaryRangeValue').innerText = salaryRange;
    
    const employeeList = getEmployeesFromStorage();
    const filteredList = employeeList.filter(emp => emp.salary <= salaryRange);
    
    renderEmployeeTable(filteredList);
}

// Feature 4: Export to CSV
function exportToCSV() {
    const employeeList = getEmployeesFromStorage();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "First Name,Last Name,Email,Phone,Department,Salary\n";
    
    employeeList.forEach(emp => {
        const row = `${emp.firstName},${emp.lastName},${emp.email},${emp.phone},${emp.department},${emp.salary}`;
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
}

// Feature 5: Form Auto-Save
const formElements = ['first_name', 'last_name', 'email', 'phone', 'department', 'salary'];
formElements.forEach(field => {
    document.getElementById(field).addEventListener('input', function () {
        localStorage.setItem(field, document.getElementById(field).value);
    });

    if (localStorage.getItem(field)) {
        document.getElementById(field).value = localStorage.getItem(field);
    }
});

// Feature 6: Employee Summary/Analytics
function updateAnalytics() {
    const employeeList = getEmployeesFromStorage();
    const totalEmployees = employeeList.length;
    const totalSalary = employeeList.reduce((acc, emp) => acc + parseFloat(emp.salary), 0);
    const averageSalary = totalEmployees > 0 ? (totalSalary / totalEmployees).toFixed(2) : 0;

    const employeesPerDepartment = employeeList.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {});

    document.getElementById('totalEmployees').innerText = totalEmployees;
    document.getElementById('averageSalary').innerText = averageSalary;
    document.getElementById('employeesPerDepartment').innerText = JSON.stringify(employeesPerDepartment);
}

// Feature 7: Dark Mode Toggle
document.getElementById('toggleDarkMode').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    this.innerText = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Helper Functions: Load, Save, Delete Employees from localStorage
function getEmployeesFromStorage() {
    return JSON.parse(localStorage.getItem('employees')) || [];
}

function saveEmployeesToStorage(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function loadEmployeesFromStorage() {
    const employeeList = getEmployeesFromStorage();
    renderEmployeeTable(employeeList);
}

function addEmployee(employee) {
    const employeeList = getEmployeesFromStorage();
    employeeList.push(employee);
    saveEmployeesToStorage(employeeList);
    renderEmployeeTable(employeeList);
    updateAnalytics();
}

function deleteEmployee(index) {
    const employeeList = getEmployeesFromStorage();
    employeeList.splice(index, 1);
    saveEmployeesToStorage(employeeList);
    renderEmployeeTable(employeeList);
    updateAnalytics();
}

function editEmployee(index) {
    const employeeList = getEmployeesFromStorage();
    const employee = employeeList[index];
    
    document.getElementById('first_name').value = employee.firstName;
    document.getElementById('last_name').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;
    document.getElementById('department').value = employee.department;
    document.getElementById('salary').value = employee.salary;
    
    document.getElementById('editIndex').value = index;
    document.getElementById('submitButton').innerText = 'Update Employee';
}

document.getElementById('employeeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const index = document.getElementById('editIndex').value;

    const employee = {
        firstName: document.getElementById('first_name').value,
        lastName: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        salary: document.getElementById('salary').value
    };

    if (index == -1) {
        addEmployee(employee);
    } else {
        const employeeList = getEmployeesFromStorage();
        employeeList[index] = employee;
        saveEmployeesToStorage(employeeList);
        renderEmployeeTable(employeeList);
        document.getElementById('submitButton').innerText = 'Add Employee';
        document.getElementById('editIndex').value = -1;
    }

    this.reset();
    updateAnalytics();
});
