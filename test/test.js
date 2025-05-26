// 카드 데이터
const icons = ['🍎', '🍋', '🍇', '🍉', '🍓', '🥑', '🍒', '🍑'];
const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);

// DOM 요소
const board = document.getElementById('board');

// 카드 생성
cards.forEach(icon => {
    board.insertAdjacentHTML('beforeend', `
    <div class="card" data-icon="${icon}">
        <div class="card__face card__front">?</div>
        <div class="card__face card__back">${icon}</div>
    </div>
    `);
});

// 게임 로직
let firstCard = null;
let lockBoard = false;

board.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card || lockBoard || card === firstCard || card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        const match = firstCard.dataset.icon === card.dataset.icon;
        if (match) {
            firstCard.classList.add('is-matched');
            card.classList.add('is-matched');
            firstCard = null;

            if (document.querySelectorAll('.is-matched').length === cards.length) {
                setTimeout(() => alert('🎉 전부 맞혔어요!'), 300);
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('is-flipped');
                card.classList.remove('is-flipped');
                firstCard = null;
                lockBoard = false;
            }, 900);
        }
    }
});
