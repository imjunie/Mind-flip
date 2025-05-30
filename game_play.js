// 
const params = new URLSearchParams(window.location.search);
const value = params.get("value");

if (value) {
  document.body.classList.add(`value-${value}`);
}

// 랜던(무작위) 정수 생성
function generateRandomNumbers(count, max) {
    let numbers = new Set();
    while (numbers.size < count){
        let random = Math.floor(Math.random() * (max + 1));
        numbers.add(random);
    }
    return Array.from(numbers);
}

// API를 불러오기 -> JSON 형태 (배열?)의 API 데이터를 받기
// async는
async function imageAPICall(id) {
    const apiUrl = 'https://akabab.github.io/superhero-api/api/id/' + id + '.json';
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl, {method: "GET"});
        if (response.status === 200) { // HTTP 응답 상태 코드 참고고
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

// ---올리비아: 해보기---
// async function imageAPICall() {
//     const apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';
//     console.log(apiUrl);
//     try {
//         const response = await fetch(apiUrl);
//         if (response.status === 200) { // HTTP 응답 상태 코드 참고고
//             const data = await response.json(); // Parse JSON
//             console.log(data);
//             return data;
//         }
//         else {
//             throw new Error('네트워크의 응답이 안 좋습니다.')
//         }
//     } catch (error) {
//         console.error('오류:', error);
//         return null;
//     }
// }

const apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (response.status === 200) {
      const data = await response.json(); // properly await the parsed JSON
      console.log(data);
    } else {
      console.error("Failed to fetch: Status code", response.status);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

fetchData();
// ---올리비아---



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


let images = generateRandomNumbers(value, 30);
console.log(images);

// const icons = ['🍎', '🍋', '🍇', '🍉'];

// 이미지 URL을 복제
const cards = [...images, ...images].sort(() => Math.random() - 0.5);

// DOM 요소
const board = document.getElementById('board');

// 카드 생성
renderCards(cards);



// 게임 로직
let firstCard = null;
let lockBoard = false;
// firstCard: 사용자가 처음 클릭한 카드를 저장하는 변수
// lockBoard: board를 잠그는 플래그; true면 카드 클릭을 막음, false면 클릭 가능


board.addEventListener('click', e => {
    // .addEventListener: 사용자가 클릭할 때마다 안에 있는 프로그램이 실행됨
    const card = e.target.closest('.card');
    if (!card || lockBoard || card === firstCard || card.classList.contains('is-matched')) return;
    // if..
    // 1. 클릭한 요소가 카드가 아니거나(!card)
    // 2. 보드가 잠겨 있거나(lockBoard (== true))
    // 3. 이미 첫 번째 카드로 선택된 카드거나(card === firstCard)
    // 4. 이미 매칭되어 뒤집힌 카드라면(card.classList.contains('is-matched'))
    // 함수 실행을 중단하고 아무 동작도 하지 않음

    card.classList.add('is-flipped');

    if (!firstCard) { // 뒤집힌 카드가 없으면
        firstCard = card;
    } else {
        const match = firstCard.dataset.id === card.dataset.id;
        if (match) {
            // firstCard.classList.remove('is-flipped');
            // card.classList.remove('is-flipped');
            firstCard.classList.add('is-matched');
            card.classList.add('is-matched');
            firstCard = null;
            
            if (document.querySelectorAll('.is-matched').length === cards.length) {
                setTimeout(() => alert('🎉 전부 맞혔어요!'), 10); // in ms (works like delay, run the function after certain ms)
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('is-flipped');
                card.classList.remove('is-flipped');
                firstCard = null;
                lockBoard = false;
            }, 700);
        }
    }
});