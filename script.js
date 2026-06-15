// 음식 데이터 정의 (타코 추가 포함)
const foods = [
    {
        name: "피자",
        emoji: "🍕",
        price: 25000
    },
    {
        name: "치킨",
        emoji: "🍗",
        price: 23000
    },
    {
        name: "햄버거",
        emoji: "🍔",
        price: 12000
    },
    {
        name: "짜장면",
        emoji: "🍜",
        price: 10000
    },
    {
        name: "초밥",
        emoji: "🍣",
        price: 28000
    },
    {
        name: "타코",
        emoji: "🌮",
        price: 15000
    }
];

// 배달 진행 중 랜덤 문구
const funnyTexts = [
    "사장님이 열심히 요리하는 척하고 있습니다.",
    "라이더가 출발한 척하고 있습니다.",
    "음식 냄새가 나는 기분입니다.",
    "지갑이 행복해하고 있습니다.",
    "건강이 +1 상승했습니다.",
    "가상의 라이더가 신호를 완벽히 준수하며 오고 있습니다.",
    "이 배달로 지구 온난화 방지에 기여했습니다.",
    "칼로리 0kcal! 죄책감도 0%!"
];

// 배달 단계 정의
const progressSteps = [
    { title: "주문 접수", percentage: 0 },
    { title: "조리 시작", percentage: 20 },
    { title: "조리 완료", percentage: 40 },
    { title: "배달 출발", percentage: 60 },
    { title: "곧 도착", percentage: 80 },
    { title: "배달 완료", percentage: 100 }
];

// 상태 변수
let selectedFood = null;
let currentStep = 0;
let progressInterval = null;
let funnyInterval = null;

// DOM 요소
const viewHome = document.getElementById("view-home");
const viewConfirm = document.getElementById("view-confirm");
const viewProgress = document.getElementById("view-progress");
const viewCompleted = document.getElementById("view-completed");

const foodListContainer = document.getElementById("food-list-container");
const totalSavedMoneyEl = document.getElementById("total-saved-money");
const fakeOrderCountEl = document.getElementById("fake-order-count");
const preventionRateEl = document.getElementById("prevention-rate");

// Confirm View Elements
const confirmEmojiEl = document.getElementById("confirm-emoji");
const confirmNameEl = document.getElementById("confirm-name");
const confirmPriceEl = document.getElementById("confirm-price");
const btnOrderConfirm = document.getElementById("btn-order-confirm");
const btnOrderCancel = document.getElementById("btn-order-cancel");

// Progress View Elements
const statusTitleEl = document.getElementById("status-title");
const progressBarFill = document.getElementById("progress-bar-fill");
const progressPercentageEl = document.getElementById("progress-percentage");
const funnyTextEl = document.getElementById("funny-text");
const stepEls = document.querySelectorAll(".status-steps .step");

// Completed View Elements
const todaySavedMoneyEl = document.getElementById("today-saved-money");
const feedbackBox = document.getElementById("feedback-box");
const postFeedbackBox = document.getElementById("post-feedback-box");
const btnFeedbackYes = document.getElementById("btn-feedback-yes");
const btnFeedbackNo = document.getElementById("btn-feedback-no");
const btnRestart = document.getElementById("btn-restart");

// 초기화
window.addEventListener("DOMContentLoaded", () => {
    initStats();
    renderFoodList();
    setupEventListeners();
});

// 통계 데이터 초기화 및 렌더링
function initStats() {
    // 기본값 설정 (사용자 요청 예시에 152000원, 12회가 있으면 첫 시작 시 친근감을 위해 설정하거나 0부터 시작)
    // 0부터 시작하되 이전에 저장된 값을 읽어옴
    let totalSaved = localStorage.getItem("totalSavedMoney");
    let orderCount = localStorage.getItem("fakeOrderCount");
    let preventedCount = localStorage.getItem("preventedOrderCount");
    let feedbackCount = localStorage.getItem("totalFeedbackCount");

    if (totalSaved === null) {
        // 첫 사용자를 위해 기본 0원 세팅
        localStorage.setItem("totalSavedMoney", "0");
        totalSaved = "0";
    }
    if (orderCount === null) {
        localStorage.setItem("fakeOrderCount", "0");
        orderCount = "0";
    }
    if (preventedCount === null) {
        localStorage.setItem("preventedOrderCount", "0");
        preventedCount = "0";
    }
    if (feedbackCount === null) {
        localStorage.setItem("totalFeedbackCount", "0");
        feedbackCount = "0";
    }

    const totalSavedNum = parseInt(totalSaved, 10);
    const orderCountNum = parseInt(orderCount, 10);
    const preventedNum = parseInt(preventedCount, 10);
    const feedbackNum = parseInt(feedbackCount, 10);

    // 실제 주문 방지율 계산
    const preventionRate = feedbackNum > 0 ? Math.round((preventedNum / feedbackNum) * 100) : 0;

    totalSavedMoneyEl.textContent = totalSavedNum.toLocaleString() + "원";
    fakeOrderCountEl.textContent = orderCountNum.toLocaleString() + "회";
    preventionRateEl.textContent = feedbackNum > 0 ? preventionRate + "%" : "0%";
}

// 음식 목록 생성
function renderFoodList() {
    foodListContainer.innerHTML = "";
    foods.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div class="food-card-left">
                <div class="food-emoji">${food.emoji}</div>
                <div class="food-details">
                    <span class="food-name">${food.name}</span>
                    <span class="food-price">${food.price.toLocaleString()}원</span>
                </div>
            </div>
            <button class="btn-select-food">주문하기</button>
        `;
        
        // 카드 클릭 시 주문 확인으로 이동
        card.addEventListener("click", () => {
            selectFood(food);
        });
        
        foodListContainer.appendChild(card);
    });
}

// 화면 전환 헬퍼 함수
function switchView(targetView) {
    [viewHome, viewConfirm, viewProgress, viewCompleted].forEach(view => {
        view.classList.add("hidden");
    });
    targetView.classList.remove("hidden");
}

// 음식 선택
function selectFood(food) {
    selectedFood = food;
    confirmEmojiEl.textContent = food.emoji;
    confirmNameEl.textContent = food.name;
    confirmPriceEl.textContent = food.price.toLocaleString() + "원";
    switchView(viewConfirm);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 주문 취소
    btnOrderCancel.addEventListener("click", () => {
        selectedFood = null;
        switchView(viewHome);
    });

    // 주문 수락 -> 가짜 배달 시작
    btnOrderConfirm.addEventListener("click", () => {
        startFakeDelivery();
    });

    // 피드백: 실제 주문을 시킬 생각이 듭니까? -> 예 (방지율 실패)
    btnFeedbackYes.addEventListener("click", () => {
        submitFeedback(false);
    });

    // 피드백: 실제 주문을 시킬 생각이 듭니까? -> 아니오 (방지율 성공)
    btnFeedbackNo.addEventListener("click", () => {
        submitFeedback(true);
    });

    // 다시 하기
    btnRestart.addEventListener("click", () => {
        switchView(viewHome);
        initStats(); // 통계 새로고침
    });
}

// 가짜 배달 시작 로직
function startFakeDelivery() {
    switchView(viewProgress);
    currentStep = 0;
    updateProgressUI();

    // 3초마다 랜덤 문구 노출 설정
    changeFunnyText();
    funnyInterval = setInterval(changeFunnyText, 3000);

    // 5초마다 배달 단계 진행
    progressInterval = setInterval(() => {
        currentStep++;
        if (currentStep < progressSteps.length) {
            updateProgressUI();
        } else {
            // 배달 종료 및 완료 처리
            completeDelivery();
        }
    }, 5000);
}

// 배달 진행 UI 동적 업데이트
function updateProgressUI() {
    const stepData = progressSteps[currentStep];
    statusTitleEl.textContent = stepData.title;
    progressBarFill.style.width = stepData.percentage + "%";
    progressPercentageEl.textContent = stepData.percentage + "%";

    // 점진적인 스텝 표시기 업데이트
    stepEls.forEach(el => {
        const stepNum = parseInt(el.getAttribute("data-step"), 10);
        if (stepNum <= currentStep) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
}

// 랜덤 문구 변경
function changeFunnyText() {
    const randomIndex = Math.floor(Math.random() * funnyTexts.length);
    funnyTextEl.textContent = funnyTexts[randomIndex];
}

// 가짜 배달 완료 처리
function completeDelivery() {
    clearInterval(progressInterval);
    clearInterval(funnyInterval);

    // 로컬 스토리지 누적 데이터 업데이트
    const currentSaved = parseInt(localStorage.getItem("totalSavedMoney") || "0", 10);
    const currentOrders = parseInt(localStorage.getItem("fakeOrderCount") || "0", 10);

    const newSaved = currentSaved + selectedFood.price;
    const newOrders = currentOrders + 1;

    localStorage.setItem("totalSavedMoney", newSaved.toString());
    localStorage.setItem("fakeOrderCount", newOrders.toString());

    // 완료 화면 노출 설정
    todaySavedMoneyEl.textContent = selectedFood.price.toLocaleString() + "원";
    
    // 피드백 박스 보이기 및 기존 제출 내역 초기화
    feedbackBox.classList.remove("hidden");
    postFeedbackBox.classList.add("hidden");

    switchView(viewCompleted);
}

// 피드백 등록
function submitFeedback(isPrevented) {
    const preventedCount = parseInt(localStorage.getItem("preventedOrderCount") || "0", 10);
    const feedbackCount = parseInt(localStorage.getItem("totalFeedbackCount") || "0", 10);

    localStorage.setItem("totalFeedbackCount", (feedbackCount + 1).toString());
    if (isPrevented) {
        localStorage.setItem("preventedOrderCount", (preventedCount + 1).toString());
    }

    // 피드백 영역 숨김 후 완료 안내
    feedbackBox.classList.add("hidden");
    postFeedbackBox.classList.remove("hidden");
}
