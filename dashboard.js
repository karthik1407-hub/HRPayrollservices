// Preloader
window.onload = function() {
    document.getElementById('preloader').style.display = 'none';
}

// Dark Mode Toggle
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Open Modal
function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

// Close Modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Handle Add Employee Submission
function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;

    if (name && role) {
        addEmployeeCard(name, role);
        updateNotificationCount();
        closeModal();
    } else {
        alert('Please fill out both fields.');
    }
}

// Add Employee Card
function addEmployeeCard(name, role) {
    const employeeCards = document.getElementById('employee-cards');
    const card = document.createElement('div');
    card.classList.add('employee-card');
    card.draggable = true;
    card.innerHTML = `<h4>${name}</h4><p>${role}</p>`;
    
    // Card fade-in animation
    card.style.opacity = 0;
    employeeCards.appendChild(card);
    
    setTimeout(() => {
        card.style.opacity = 1;
    }, 100);
}

// Update Notification Count
function updateNotificationCount() {
    const notifCount = document.getElementById('notif-count');
    let currentCount = parseInt(notifCount.innerText);
    notifCount.innerText = currentCount + 1;
}

// Employee Search
function searchEmployee() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const cards = document.querySelectorAll('.employee-card');

    cards.forEach(card => {
        const name = card.querySelector('h4').innerText.toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
