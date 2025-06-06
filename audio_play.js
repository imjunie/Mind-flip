// // 1. 요소 정확히 선택
// const soundBtn = document.getElementById("soundbtn");
// const soundImg = soundBtn.querySelector("img"); // ✅ img 태그 선택

// // 2. 오디오 초기화
// const bgm = new Audio("audio/cooking-childhood-cute-happy-song-289238.mp3");
// bgm.loop = true;
// let isPlaying = false;

// // 3. 클릭 이벤트 리스너
// soundBtn.addEventListener("click", async () => {
//     if (isPlaying) {
//         bgm.pause();
//         soundImg.src = "./images/soundmuted.png";
//         isPlaying = false;
//     } else {
//         try {
//             await bgm.play();
//             soundImg.src = "./images/sound.png";
//             isPlaying = true;
//         } catch (e) {
//             console.error("오디오 재생 실패:", e);
//         }
//     }
// });



// 1. 요소 정확히 선택
const soundBtn = document.getElementById("soundbtn");
const soundImg = soundBtn.querySelector("img"); // ✅ img 태그 선택

// 2. 오디오 초기화
const bgm = new Audio("audio/cooking-childhood-cute-happy-song-289238.mp3");
bgm.loop = true;
let isPlaying = false;

// ✅ 3-1. 페이지 어디든 클릭 시 한번만 자동 재생 시도
document.addEventListener("click", () => {
    if (!isPlaying) {
        bgm.play().then(() => {
            soundImg.src = "./images/sound.png";
            isPlaying = true;
        }).catch(e => console.warn("자동재생 실패:", e));
    }
}, { once: true });

// ✅ 3-2. 버튼 클릭으로 음소거 / 해제 제어
soundBtn.addEventListener("click", async () => {
    if (isPlaying) {
        bgm.pause();
        soundImg.src = "./images/soundmuted.png";
        isPlaying = false;
    } else {
        try {
            await bgm.play();
            soundImg.src = "./images/sound.png";
            isPlaying = true;
        } catch (e) {
            console.error("오디오 재생 실패:", e);
        }
    }
});
