// 카드 데이터
// const icons = ['🍎', '🍋', '🍇', '🍉', '🍓', '🥑', '🍒', '🍑'];

const params = new URLSearchParams(window.location.search);
const value = params.get("value");


// GenerateRandomNumbers 

function generateRandomNumbers(count, max) {
    let numbers = new Set();
    while (numbers.size < count){
        let random = Math.floor(Math.random() * (max + 1));
        numbers.add(random);
    }
    return Array.from(numbers);
}

// function imageAPICall(id) {
//     const apiUrl = 'https://akabab.github.io/superhero-api/api/id/' + id + '.json';
//     console.log(apiUrl);

//     // Make a GET Request
//     fetch(apiUrl)
//     .then(response => {
//         console.log(response)
//         if (response.status === 200) {
//             return response.json();
//         }
//         else {
//             throw new Error('네트워크의 응답이 안 좋습니다.')
//         }
//     })
//     .then(data => {
//         console.log(data.images.sm);
//         return data.images.sm;
//     })
//     .catch(error => {
//         console.error('오류:', error);
//     });
// }

async function imageAPICall(id) {
    const apiUrl = 'https://akabab.github.io/superhero-api/api/id/' + id + '.json';
    console.log(apiUrl);
    try{
        const response = await fetch(apiUrl);
        if (response.status === 200) {
            const data = await response.json(); // Parse JSON
            return data.images.xs;
        }
        else {
            throw new Error('네트워크의 응답이 안 좋습니다.')
        }
    } catch (error) {
        console.error('오류:', error);
        return null;
    }
}

// TRY TO TAKE ALL API
async function imageAPICall() {
    const apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) { // HTTP 응답 상태 코드 참고
            const data = await response.json(); // Parse JSON
            console.log(data);
            return data;
        }
        else {
            throw new Error('네트워크의 응답이 안 좋습니다.')
        }
    } catch (error) {
        console.error('오류:', error);
        return null;
    }
}
const apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';
console.log(apiUrl);
const response =  fetch(apiUrl);
if (response.status === 200) { // HTTP 응답 상태 코드 참고
    const data =  response.json(); // Parse JSON
    console.log(data);}





async function renderCards(cards) {
    for (const id of cards) {
        const imageURL = await imageAPICall(id);

        board.insertAdjacentHTML('beforeend', `
        <div class="card" data-id="${id}">
            <div class="card__face card__front">?</div>
            <div class="card__face card__back"><img class="back-face" src="${imageURL}"/></div>
        </div>
        `);
    } 
}


let four = generateRandomNumbers(value, 30);
console.log(four);

const icons = ['🍎', '🍋', '🍇', '🍉'];
const cards = [...four, ...four].sort(() => Math.random() - 0.5);

// DOM 요소
const board = document.getElementById('board');

// 카드 생성
renderCards(cards);

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
        const match = firstCard.dataset.id === card.dataset.id;
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