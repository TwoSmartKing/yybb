// common.js
// 封装全局变量
const app = {
    correctCount: 0,
    timeLeft: 60,
    timerId: null,
    // 缓存 DOM 元素
    timerElement: document.getElementById('timer'),
    scoreElement: document.getElementById('score'),
    problemsContainer: document.getElementById('problems-container'),
    problems: document.getElementById('problems'),
    resultModal: document.getElementById('result-modal'),
    resultText: document.getElementById('result-text'),
    restartButton: document.getElementById('restart-button'),
    startButton: document.getElementById('start-button')
};

// 创建输入框
function createInputElement(problem) {
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.pattern = "[0-9]*";
    input.disabled = true; // 开始时禁用所有输入框

    input.addEventListener('input', (e) => {
        const userInput = e.target.value;
        if (userInput.length > 3) { // 假设答案最长为3位
            e.target.value = userInput.slice(0, 10);
        }
        const correctAnswer = problem.answer.toString();

        // 逐位对比输入值和正确答案
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== correctAnswer[i]) {
                // 若有不一致，清空输入框
                setTimeout(() => {
                    e.target.value = '';
                }, 200); // 延迟200毫秒，让用户能看到输入的字符
                return;
            }
        }
        // 若输入值与正确答案完全一致，按原逻辑处理
        if (userInput === correctAnswer) {
            handleAnswer(input, problem.answer);
        }
    });

    return input;
}

// 答案处理
function handleAnswer(input, answer) {
    const userInput = input.value;
    if (!/^\d+$/.test(userInput)) return; // 确保输入为纯数字
    const userAnswer = parseInt(userInput);
    if (isNaN(userAnswer)) return;
    
    if (userAnswer === answer && !input.classList.contains('correct')) {
        app.correctCount++;
        app.scoreElement.textContent = `答对：${app.correctCount}题`;
        input.readOnly = true;
        input.classList.add('correct');
        jumpToNext(input);
    } else {
        input.classList.remove('correct');
    }
}

// 自动跳转
function jumpToNext(currentInput) {
    const allInputs = Array.from(document.querySelectorAll('input:not([readonly])'));
    const nextIndex = allInputs.indexOf(currentInput) + 1;

    if (nextIndex < allInputs.length) {
        const nextInput = allInputs[nextIndex];
        nextInput.disabled = false; // 启用下一个输入框
        nextInput.focus();
        nextInput.parentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// 倒计时
function startTimer() {
    app.timerId = setInterval(() => {
        app.timeLeft--;
        app.timerElement.textContent = `剩余：${app.timeLeft}秒`;

        if (app.timeLeft <= 0) {
            clearInterval(app.timerId);
            document.querySelectorAll('input').forEach(input => input.disabled = true);
            showResult();
        }
    }, 1000);
}

function showResult() {
    let message;
    if (app.correctCount < 10) {
        message = `答对了 <span style="color: red; font-weight: bold;">${app.correctCount}</span> 道题，继续努力哦！`;
    } else if (app.correctCount < 50) {
        message = `答对了 <span style="color: red; font-weight: bold;">${app.correctCount}</span> 道题，表现很棒！`;
    } else {
        message = `<span style="font-size: 32px; font-weight: bold;">太厉害了</span><br>答对了 <span style="color: red; font-weight: bold;">${app.correctCount}</span> 道题，你是数学小天才！`;
    }

    app.resultText.innerHTML = message.replace(/\n/g, '<br>');
    //app.resultText.textContent = message;
    app.resultModal.style.display = 'flex';
}

// 重置页面状态
function resetPage() {
    app.correctCount = 0;
    app.timeLeft = 60;
    app.timerElement.textContent = `剩余：60秒`;
    app.scoreElement.textContent = `答对：0题`;
    clearInterval(app.timerId);
    app.problemsContainer.style.display = 'none';
    app.startButton.style.display = 'block';
    initProblems();
    app.resultModal.style.display = 'none';
}

// 确保 DOM 加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', () => {
    init();
});
