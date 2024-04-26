let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isPaused = false;
let isWorkTime = true;

function startPauseTimer() {
    const startPauseButton = document.getElementById("startPause");

    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        timer = setInterval(updateTimer, 1000);
        startPauseButton.textContent = "Pause";
    } else {
        if (!isPaused) {
            isPaused = true;
            clearInterval(timer);
            startPauseButton.textContent = "Resume";
        } else {
            isPaused = false;
            timer = setInterval(updateTimer, 1000);
            startPauseButton.textContent = "Pause";
        }
    }
}

function updateTimer() {
    const timerDisplay = document.getElementById("timer");

    if (seconds === 0 && minutes === 0) {
        clearInterval(timer);
        isRunning = false;
        if (isWorkTime) {
            alert("¡Tiempo de trabajo terminado! Tómate un descanso de 5 minutos.");
            minutes = 5;
            isWorkTime = false;
        } else {
            alert("¡Tiempo de descanso terminado! Regresa al trabajo.");
            minutes = 25;
            isWorkTime = true;
        }
        seconds = 0;
        startPauseTimer();
        return;
    }

    if (seconds === 0) {
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }

    displayTime(timerDisplay);
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    isWorkTime = true;
    minutes = 25;
    seconds = 0;
    document.getElementById("startPause").textContent = "Start";
    displayTime(document.getElementById("timer"));
}

function displayTime(timerDisplay) {
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

document.getElementById("startPause").addEventListener("click", startPauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

displayTime(document.getElementById("timer"));
