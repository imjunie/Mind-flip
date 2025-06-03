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


// async는
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

//
async function renderCards(cards) {
    for (const id of cards) {
        const img_id = id_list[id];
        console.log(img_id)
        const imageURL = await imageAPICall(img_id);

        board.insertAdjacentHTML('beforeend', `
        <div class="card" data-id="${img_id}">
            <div class="card__face card__front">?</div>
            <div class="card__face card__back"><img class="back-face" src="${imageURL}"/></div>
        </div>
        `);
    } 
}



let images = generateRandomNumbers(value, (id_list.length - 1));
console.log(images);

// 이미지 URL을 복제
const cards = [...images, ...images].sort(() => Math.random() - 0.5);

// DOM 요소
const board = document.getElementById('board');

// 카드 생성
renderCards(cards);


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

    // .addEventListener: 사용자가 클릭할 때마다 안에 있는 프로그램이 실행됨
    const card = e.target.closest('.card');
    if (!card || lockBoard || card === firstCard || card.classList.contains('is-matched')) return;
    // if..
    // 1. 클릭한 요소가 카드가 아니거나(!card)
    // 2. 보드가 잠겨 있거나(lockBoard (== true))
    // 3. 이미 첫 번째 카드로 선택된 카드거나(card === firstCard)
    // 4. 이미 매칭되어 뒤집힌 카드라면(card.classList.contains('is-matched'))
    // 함수 실행을 중단하고 아무 동작도 하지 않음
    
    startTimer();

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
