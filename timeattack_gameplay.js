// 
const params = new URLSearchParams(window.location.search);
const value = params.get("value"); // 그림 개수
const difficulty = params.get("dif"); // easy 또는 hard

const titleElement = document.getElementById("title_TA");
if (titleElement && (difficulty === "Easy" || difficulty === "Hard")) {
    titleElement.textContent = `${difficulty}`
}

if (value) {
    document.body.classList.add(`value-${value}`);
}


// 이미지의 id들을 array(배열) 안에 넣음
const id_list = ["52894", "52928", "53049", "52891", "52898", "52910", "52897", "52776", "52860", "52888", "52862", "53082", "52917", "52889", "53024", "52833", "53046"];

// 랜덤(무작위) 정수 생성
function generateRandomNumbers(count, max) {
    let numbers = new Set();
    while (numbers.size < count){
        let random = Math.floor(Math.random() * (max + 1));
        numbers.add(random);
    }
    return Array.from(numbers);
}


// async 함수는: 비동기적으로 동작하는 함수
// 함수 기능: (API를 불러오기) 서버에게 요청을 보내기 -> JSON 형태의 API 데이터를 받기
async function imageAPICall(id) {
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id;
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl, {method: "GET"}); // 문자열 받기
        if (response.status === 200) { // HTTP 응답 상태 코드 참고고
            const data = await response.json(); // 문자열 형태 -> JSON 형태
            console.log(data.meals[0].strMealThumb);
            
            return data.meals[0].strMealThumb; // 이미지의 링크
        }
        else {
            throw new Error('네트워크의 응답이 안 좋습니다.')
        }
    } catch (error) {
        console.error('오류:', error);
        return null;
    }
}


// async function renderCards(cards) {
//     for (const id of cards) {
//         const img_id = id_list[id];
//         console.log(img_id)
//         const imageURL = await imageAPICall(img_id);

//         board.insertAdjacentHTML('beforeend', `
//         <div class="card" data-id="${img_id}">
//             <div class="card__face card__front">?</div>
//             <div class="card__face card__back"><img class="back-face" src="${imageURL}"/></div>
//         </div>
//         `);
//     } 
// }


async function renderCards(cards) {
    // id_list를 이미지 요청 Promise 배열로 변환 -> img_id 배열에 넣기
    const imagePromises = cards.map(async (id) => {
        const img_id = id_list[id];
        const imageURL = await imageAPICall(img_id);
        return { id: img_id, url: imageURL };
    });

    // 모든 이미지 요청이 완료될 때까지 기다리고, 결과를 배열로 받아오기
    const cardData = await Promise.all(imagePromises);
    
    // 각 이미지 데이터를 이용해 카드 HTML 문자열을 생성
    const cardsHTML = cardData.map(({ id, url }) => `
        <div class="card" data-id="${id}">
            <div class="card__face card__front">?</div>
            <div class="card__face card__back"><img class="back-face" src="${url}"/></div>
        </div>
    `).join('');
    // .join:  모든 카드 HTML을 하나의 문자열로 합침 (함꺼번에)

    // 합쳐진 카드 HTML을 board 엘리먼트의 마지막에 한 번에 추가
    board.insertAdjacentHTML('beforeend', cardsHTML);
}


let images = generateRandomNumbers(value, (id_list.length - 1));
console.log(images);

// 이미지 URL을 복제
const cards = [...images, ...images].sort(() => Math.random() - 0.5);

// DOM 요소
const board = document.getElementById('board');

let isInitialized = false;   // 렌더링 완료 여부
let showAllFronts = false;   // 전체 앞면 보여주기 여부
let isFirstClick = true;     // 스톱워치를 첫 클릭에만 시작하게 하기 위해

// 카드 생성
(async () => {
    await renderCards(cards);  // 카드 생성 완료 기다림

    // 카드 렌더링 완료 후 3초간 앞면 보여주기
    showAllFronts = true;
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('is-flipped');
    });

    setTimeout(() => {
        showAllFronts = false;
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('is-flipped');
        });
        isInitialized = true;  // 이제 클릭 가능하게 됨
    }, 2500);
})();

// 타이머 설정
let timeSet; 
let startTime;
let stopTime;
let timerInterval; // 간격

function updateDisplay() {
    if (Date.now() < stopTime) { // 지금 시간이 stopTime보다 작으면 ("시간이 남았다")
        let remaining = stopTime - Date.now();
        // console.log(remaining);
        let secs = Math.floor((remaining % 60000) / 1000);
        let ms = Math.floor((remaining % 1000) / 10);
            
        document.getElementById('Timer').textContent = 
        `${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    } else { // 지금 시간이 stopTime과 같으면 (시간이 끝났다)
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('Timer').textContent = "00.00";
        lockBoard = true;
        setTimeout(() => alert('시간 종료!'), 10);
    }
}

function startTimer() {
    if (!timerInterval) {
        if (difficulty == "Easy") {
            timeSet = 60000;
        } else if (difficulty == "Hard") {
            timeSet = 30000;
        }
        startTime = Date.now()
        stopTime = startTime + timeSet;
        timerInterval = setInterval(updateDisplay, 100);
    }
}


// 게임 로직
let firstCard = null;
let lockBoard = false;
// firstCard: 사용자가 처음 클릭한 카드를 저장하는 변수
// lockBoard: board를 잠그는 플래그; true면 카드 클릭을 막음, false면 클릭 가능


board.addEventListener('click', e => {
    if (!isInitialized) return;  // 카드가 완전히 뒤집힌 후에만 클릭 가능

    // .addEventListener: 사용자가 클릭할 때마다 안에 있는 프로그램이 실행됨
    const card = e.target.closest('.card');
    if (!card || lockBoard || card === firstCard || card.classList.contains('is-matched')) return;

    
    if (isFirstClick) {
        startTimer();
        isFirstClick = false;
    }
    // if..
    // 1. 클릭한 요소가 카드가 아니거나(!card)
    // 2. 보드가 잠겨 있거나(lockBoard (== true))
    // 3. 이미 첫 번째 카드로 선택된 카드거나(card === firstCard)
    // 4. 이미 매칭되어 뒤집힌 카드라면(card.classList.contains('is-matched'))
    // 함수 실행을 중단하고 아무 동작도 하지 않음
    
    // startTimer();

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
                clearInterval(timerInterval);
                timerInterval = null;
            }

        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('is-flipped');
                card.classList.remove('is-flipped');
                firstCard = null;
                if (timerInterval) {
                    lockBoard = false;
                } else {
                    lockBoard = true;
                }
            }, 500);
        }
    }
});

    // BGM 설정
    // Audio 객체 생성
    const bgm = new Audio("clockwork-adventure-steampunk-music-no-melody-288522.mp3");
        
    // 반복 설정
    bgm.loop = true;
        
    // 자동 재생
    bgm.autoplay = true;
        
    // 사용자가 클릭하거나 키 입력을 해야 자동 재생이 허용되는 경우 대비
    // (바닥을 클릭하면 배경음악이 나옴)
    document.addEventListener("click", () => {
        bgm.play();}, { once: true });
