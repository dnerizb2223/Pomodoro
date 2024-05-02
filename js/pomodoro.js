document.addEventListener("DOMContentLoaded", () => {
    // Pomodoro Timer
    let pomodoroTimer;
    let shortBreakTimer;
    let longBreakTimer;
    let isRunning = false;
    let isPaused = false;
    let activeTimer = null;

    // Duraciones de los temporizadores
    const pomodoroDuration = { minutes: 25, seconds: 0 };
    const shortBreakDuration = { minutes: 5, seconds: 0 };
    const longBreakDuration = { minutes: 15, seconds: 0 };

    // Variables para almacenar el tiempo restante cuando se pausa el temporizador
    let remainingTime = { minutes: 0, seconds: 0 };

    // Función para iniciar el temporizador
    function startTimer(duration, display) {
        let timer = duration.minutes * 60 + duration.seconds;

        return setInterval(function () {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(pomodoroTimer);
                timerAlert();
            }
        }, 1000);
    }

// Función para iniciar o pausar el temporizador
function startPauseTimer(timer, duration, display) {
    const startPauseButton = timer === "pomodoro" ? document.getElementById("startPause") : timer === "shortBreak" ? document.getElementById("shortBreakStart") : document.getElementById("longBreakStart");

    if (!isRunning) {
        if (remainingTime.minutes === 0 && remainingTime.seconds === 0) {
            window[timer + "Timer"] = startTimer(duration, display);
        } else {
            window[timer + "Timer"] = startTimer(remainingTime, display);
            remainingTime = { minutes: 0, seconds: 0 };
        }
        startPauseButton.textContent = "Pause";
        isRunning = true;
        activeTimer = timer; // Establecer el temporizador activo aquí
        disableOtherTimers(timer);
    } else {
        clearInterval(window[activeTimer + "Timer"]);
        remainingTime = { minutes: parseInt(display.textContent.split(':')[0]), seconds: parseInt(display.textContent.split(':')[1]) };
        window[activeTimer + "Timer"] = null;
        startPauseButton.textContent = "Start";
        isRunning = false;
        activeTimer = null;
        enableAllTimers();
    }
}


    // Función para reiniciar el temporizador
    function resetTimer(timer, duration, display) {
        clearInterval(window[timer + "Timer"]);
        window[timer + "Timer"] = null;
        display.textContent = `${duration.minutes < 10 ? "0" + duration.minutes : duration.minutes}:${duration.seconds < 10 ? "0" + duration.seconds : duration.seconds}`;
        remainingTime = { minutes: 0, seconds: 0 };
        isRunning = false;
        isPaused = false;
        activeTimer = null;
        enableAllTimers();
    }

    // Función para mostrar una alerta cuando el temporizador llega a cero
    function timerAlert() {
        alert("Time's up!");
    }

    // Función para actualizar el tiempo mostrado
    function displayTime(display, minutes, seconds) {
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
        display.textContent = `${displayMinutes}:${displaySeconds}`;
    }

    // Función para deshabilitar los botones de inicio de los temporizadores que no están activos
    function disableOtherTimers(timer) {
        const timers = ["pomodoro", "shortBreak", "longBreak"];
        timers.forEach(t => {
            const startButton = document.getElementById(t + "Start");
            if (startButton && t !== timer) {
                startButton.disabled = true;
            }
        });
    }


    // Función para habilitar todos los botones de inicio de temporizadores
    function enableAllTimers() {
        const timers = ["pomodoro", "shortBreak", "longBreak"];
        timers.forEach(t => {
            const startButton = document.getElementById(t + "Start");
            if (startButton) {
                startButton.disabled = false;
            }
        });
    }


    // Event listeners para iniciar o pausar los temporizadores
    document.getElementById("startPause").addEventListener("click", () => startPauseTimer("pomodoro", pomodoroDuration, document.getElementById("pomodoro-timer")));
    document.getElementById("shortBreakStart").addEventListener("click", () => startPauseTimer("shortBreak", shortBreakDuration, document.getElementById("short-break-timer")));
    document.getElementById("longBreakStart").addEventListener("click", () => startPauseTimer("longBreak", longBreakDuration, document.getElementById("long-break-timer")));

    // Event listeners para reiniciar los temporizadores
    document.getElementById("reset").addEventListener("click", () => resetTimer(activeTimer, pomodoroDuration, document.getElementById(activeTimer + "-timer")));

    // Kanban Board---------------------------------------------------------------------------------------
    const pendingColumn = document.getElementById("pending-column");
    const progressColumn = document.getElementById("progress-column");
    const completedColumn = document.getElementById("completed-column");

    let draggedTask = null;

    // Event listeners for drag-and-drop functionality
    [pendingColumn, progressColumn, completedColumn].forEach(column => {
        column.addEventListener("dragover", e => {
            e.preventDefault();
        });

        column.addEventListener("drop", e => {
            e.preventDefault();
            const task = draggedTask;
            const targetColumn = e.target.closest(".column");

            if (targetColumn !== column) {
                targetColumn.appendChild(task);
                // Update task category when dropped into a new column
                const newCategory = targetColumn.getAttribute("data-category");
                task.dataset.category = newCategory;
            }

            draggedTask = null;
        });
    });

    // Event listener to handle task deletion
    document.addEventListener("click", event => {
        if (event.target.classList.contains("task")) {
            const confirmDelete = confirm("Are you sure you want to delete this task?");
            if (confirmDelete) {
                event.target.remove();
            }
        }
    });

    // Event listeners for task dragging
    document.querySelectorAll(".task").forEach(task => {
        task.addEventListener("dragstart", e => {
            draggedTask = e.target;
        });
    });

    // Event listener to open the new task modal
    const newTaskButton = document.getElementById("new-task-button");
    const newTaskModal = document.getElementById("new-task-modal");

    newTaskButton.addEventListener("click", () => {
        newTaskModal.style.display = "block";
    });

    // Close the modal when the close button is clicked
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", () => {
        newTaskModal.style.display = "none";
    });

    // Event listener to create a new task
    const newTaskForm = document.getElementById("new-task-form");
    newTaskForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const category = document.getElementById("task-category").value;
        addTaskToPending(title, description, category); // Add the task directly to the "Pending" section
        newTaskForm.reset();
        newTaskModal.style.display = "none"; // Close the modal after submitting the form
    });

    // Function to create a new task
    function createTask(title, description, category) {
        const task = document.createElement("div");
        task.classList.add("task");
        task.setAttribute("draggable", "true");
        task.dataset.category = category;

        const taskTitle = document.createElement("h3");
        taskTitle.textContent = title;

        const taskDescription = document.createElement("p");
        taskDescription.textContent = description;

        const taskCategory = document.createElement("p");
        taskCategory.textContent = category;

        task.appendChild(taskTitle);
        task.appendChild(taskDescription);
        task.appendChild(taskCategory);

        return task;
    }

    // Function to add a task to the pending column
    function addTaskToPending(title, description, category) {
        const task = createTask(title, description, category);
        document.getElementById("pending-column").appendChild(task);
    }

    // Example usage:
    addTaskToPending("Finish Project", "Complete the remaining tasks for the project", "Backend");
});
