function toggleDetails(card) {
    const cardInner = card.querySelector('.card-inner');
    cardInner.classList.toggle('flipped');
}

// Add this CSS class to handle the flipping
document.addEventListener('DOMContentLoaded', () => {
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.classList.toggle('flipped');
        });
    });
});
