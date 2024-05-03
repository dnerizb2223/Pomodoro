document.addEventListener("DOMContentLoaded", () => {
    let timer;
    let isRunning = false;
    let isPomodoro = true;
    const pomodoroDuration = { minutes: 25, seconds: 0 };
    const shortBreakDuration = { minutes: 5, seconds: 0 };
    const longBreakDuration = { minutes: 15, seconds: 0 };    
    let pomodoroCount = 1;

    function startTimer(duration, display) {
        let totalSeconds = duration.minutes * 60 + duration.seconds;

        return setInterval(function () {
            let minutes = parseInt(totalSeconds / 60, 10);
            let seconds = parseInt(totalSeconds % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--totalSeconds < 0) {
                clearInterval(timer);
                // timerAlert();
                if (isPomodoro) {
                    if (pomodoroCount < 4) {
                        startBreak(shortBreakDuration, "Descanso Corto");
                    } else {
                        startBreak(longBreakDuration, "Descanso Largo");
                    }
                } else {
                    pomodoroCount++;
                    if (pomodoroCount >= 5) {
                        pomodoroCount = 0;
                        document.getElementById("start").disabled = false;
                    }
                    startPomodoro(pomodoroDuration, "Pomodoro");
                }
            }
        }, 1000);
    }

    function startPomodoro(duration, label) {
        isPomodoro = true;
        document.getElementById("start").disabled = true;
        document.getElementById("task-select").disabled = true; // Desactivar el select durante el Pomodoro
        timer = startTimer(duration, document.getElementById("timer"));
        document.getElementById("timer-label").textContent = label;
    }
    
    function startBreak(duration, label) {
        isPomodoro = false;
        document.getElementById("start").disabled = true;
        document.getElementById("task-select").disabled = true; // Activar el select durante la pausa corta
        timer = startTimer(duration, document.getElementById("timer"));
        document.getElementById("timer-label").textContent = label;
    }
    
    

    document.getElementById("start").addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            startPomodoro(pomodoroDuration, "Pomodoro");
            document.getElementById("task-select").disabled = true;
        }
    });

    // function timerAlert() {
    //     alert("¡Tiempo completado!");
    //     document.getElementById("task-select").disabled = false;
    // }    

    // Kanban
    const pendingColumn = document.getElementById("pending-column");
    const progressColumn = document.getElementById("progress-column");
    const completedColumn = document.getElementById("completed-column");

    let draggedTask = null;

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
                const newCategory = targetColumn.getAttribute("data-category");
                task.dataset.category = newCategory;
            }

            draggedTask = null;
        });
    });

    document.querySelectorAll(".task").forEach(task => {
        task.addEventListener("dragstart", e => {
            draggedTask = e.target;
        });      
    });

    document.addEventListener("click", event => {
            if (event.target.classList.contains("task")) {
                const confirmDelete = confirm("Are you sure you want to delete this task?");
                if (confirmDelete) {
                    event.target.remove();
                }
            }
        });   
    const newTaskButton = document.getElementById("new-task-button");
    const newTaskModal = document.getElementById("new-task-modal");

    newTaskButton.addEventListener("click", () => {
        newTaskModal.style.display = "block";
    });

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", () => {
        newTaskModal.style.display = "none";
    });

    const newTaskForm = document.getElementById("new-task-form");
    newTaskForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const category = document.getElementById("task-category").value;
        addTaskToPending(title, description, category);
        updateTaskSelector(); // Actualizar el selector de tareas
        newTaskForm.reset();
        newTaskModal.style.display = "none";
    });

    // Nueva función para actualizar el selector de tareas
    function updateTaskSelector() {
        const taskSelect = document.getElementById("task-select");
        taskSelect.innerHTML = ""; // Limpiar opciones existentes

        // Recorrer todas las tareas y agregarlas como opciones
        document.querySelectorAll(".task").forEach(task => {
            const option = document.createElement("option");
            option.value = task.querySelector("h3").textContent;
            option.textContent = task.querySelector("h3").textContent;
            taskSelect.appendChild(option);
        });
    }

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

    function addTaskToPending(title, description, category) {
        const task = createTask(title, description, category);
        pendingColumn.appendChild(task);
    }

    // Inicialmente agregar una tarea de ejemplo
    addTaskToPending("Terminar Proyecto", "Completar las tareas restantes para el proyecto", "Backend");
    // Actualizar el selector de tareas
    updateTaskSelector();
});
