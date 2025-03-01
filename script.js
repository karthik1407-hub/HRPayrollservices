// Simple Calendar Implementation
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            // Example events
            { title: 'Company Meeting', start: '2024-10-05' },
            { title: 'Project Deadline', start: '2024-10-10' },
            { title: 'Employee Training', start: '2024-10-15' }
        ]
    });

    calendar.render();
});
