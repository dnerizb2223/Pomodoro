let timer;
let minutes = 5;
let seconds = 0;
let isRunning = false;
let isPaused = false;

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
    if (seconds === 0 && minutes === 0) {
        clearInterval(timer);
        isRunning = false;
        alert("¡Tiempo terminado!");
        return;
    }

    if (seconds === 0) {
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }

    displayTime();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    minutes = 5; // Cambiado de 25 a 5
    seconds = 0;
    document.getElementById("startPause").textContent = "Start";
    displayTime();
}

function displayTime() {
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    document.getElementById("timer").textContent = `${displayMinutes}:${displaySeconds}`;
}

document.getElementById("startPause").addEventListener("click", startPauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

displayTime();
