// Sample data for the payroll report
const payrollData = [
    { employee: 'John Doe', hours: 160, grossPay: 5000, taxes: 800, netPay: 4200 },
    { employee: 'Jane Smith', hours: 170, grossPay: 5100, taxes: 850, netPay: 4250 },
    { employee: 'Sam Wilson', hours: 165, grossPay: 4900, taxes: 780, netPay: 4120 },
];

// Function to load payroll data into the table
function loadPayrollData() {
    const reportTable = document.getElementById('reportTable');
    payrollData.forEach((data) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.employee}</td>
            <td>${data.hours}</td>
            <td>$${data.grossPay}</td>
            <td>$${data.taxes}</td>
            <td>$${data.netPay}</td>
        `;
        reportTable.appendChild(row);
    });
}

// Function to create line chart (example: employee working hours)
function createLineChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: payrollData.map(data => data.employee),
            datasets: [{
                label: 'Hours Worked',
                data: payrollData.map(data => data.hours),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create bar chart (example: employee net pay)
function createBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: payrollData.map(data => data.employee),
            datasets: [{
                label: 'Net Pay',
                data: payrollData.map(data => data.netPay),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize charts and load table data on page load
window.onload = function () {
    loadPayrollData();
    createLineChart();
    createBarChart();
};
