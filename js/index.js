// Sélection des éléments du DOM

const taskForm = document.getElementById("task-form");
const newTaskButton = document.getElementById("nouvelle-tache");
const cancelTaskButton = document.getElementById("cancel-task");
const searchInput = document.getElementById("searchInput");

const todoColumn = document.getElementById("todo-column").querySelector('[data-status="À faire"]');
const progressColumn = document.getElementById("progress-column").querySelector('[data-status="En cours"]');
const doneColumn = document.getElementById("done-column").querySelector('[data-status="Terminées"]');

const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");

const modalContainer = document.getElementById("modal-container");

const todoCount = document.querySelector('#todo-column .task-count');
const progressCount = document.querySelector('#progress-column .task-count');
const doneCount = document.querySelector('#done-column .task-count');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function createNewTask(formData) {
    return {
        id: Date.now().toString(),
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate"),
        status: "À faire"
    };
}

function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "bg-blue-500 text-white px-4 py-2 rounded shadow-lg";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function getPriorityStyles(priority) {
    switch(priority.toLowerCase()){
        case 'haute': return {border: 'border-l-4 border-red-500 border'}; break;
        case 'moyenne': return {border: 'border-l-4 border-yellow-500 border'}; break;
        case 'basse': return {border: 'border-l-4 border-green-500 border'}; break;
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement("div");
    const priorityStyles = getPriorityStyles(task.priority);
    taskElement.className = `
        ${priorityStyles.border}
        p-4 rounded-md mb-2 bg-white shadow-sm
        hover:shadow-md transition-shadow duration-200
        relative
    `;
    taskElement.dataset.taskId = task.id;

    const dueDateClass = isDueDateOverdue(task.dueDate) ? 'text-red-500' : 'text-green-500';
    taskElement.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="font-bold text-gray-800">${task.title}</h3>
            <button class="text-gray-500 hover:text-red-500 delete-task" 
                    data-task-id="${task.id}">×</button>
        </div>
        <p class="text-gray-600 text-sm my-2">${task.description}</p>
        <div class="text-xs ${dueDateClass} mb-2">
            <span>📅 Livraison sera le : ${new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div class="flex gap-2">
            ${task.status === "À faire" ? 
                `<button class="start-task text-blue-500 hover:text-blue-700 text-sm" data-task-id="${task.id}">
                    ▶️ Commencer
                </button>` : ""}
            ${task.status === "En cours" ? 
                `<button class="complete-task text-green-500 hover:text-green-700 text-sm" data-task-id="${task.id}">
                    ✅ Terminer
                </button>` : ""}
        </div>
    `;

    addTaskButtonListeners(taskElement, task.id);

    return taskElement;
}

function addTaskButtonListeners(taskElement, taskId) {
    taskElement.querySelector('.delete-task')?.addEventListener('click', () => {
        deleteTask(taskId);
    });

    taskElement.querySelector('.start-task')?.addEventListener('click', () => {
        startTask(taskId);
    });

    taskElement.querySelector('.complete-task')?.addEventListener('click', () => {
        completeTask(taskId);
    });
}

function updateTaskLists(searchFilter = '') {
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchFilter.toLowerCase())
    );

    todoColumn.innerHTML = "";
    progressColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    let totalTasks = filteredTasks.length;
    let completedTasks = 0;

    filteredTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        
        switch (task.status) {
            case "À faire":
                todoColumn.appendChild(taskElement);
                break;
            case "En cours":
                progressColumn.appendChild(taskElement);
                break;
            case "Terminées":
                doneColumn.appendChild(taskElement);
                completedTasks++;
                break;
        }
    });

    updateCounters(filteredTasks);
    updateProgress(completedTasks, totalTasks);
}

function updateCounters(filteredTasks) {
    const counts = {
        "À faire": 0,
        "En cours": 0,
        "Terminées": 0
    };

    filteredTasks.forEach(task => {
        counts[task.status]++;
    });

    todoCount.textContent = `(${counts["À faire"]})`;
    progressCount.textContent = `(${counts["En cours"]})`;
    doneCount.textContent = `(${counts["Terminées"]})`;
}

function updateProgress(completed, total) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressText.textContent = `${completed} tâche${completed > 1 ? 's' : ''} terminée${completed > 1 ? 's' : ''}`;
    progressPercentage.textContent = `${percentage.toFixed(0)}%`;
    progressBar.style.width = `${percentage}%`;
}

function startTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = "En cours";
        saveTasks();
        updateTaskLists();
        showToast("Tâche démarrée ! 🚀");
    }
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = "Terminées";
        saveTasks();
        updateTaskLists();
        showToast("Tâche terminée ! 🎉");
    }
}

function deleteTask(taskId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        updateTaskLists();
        showToast("Tâche supprimée ! 🗑️");
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fonction pour vérifier si la date d'échéance est dépassée
function isDueDateOverdue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
}

newTaskButton.addEventListener("click", () => {
    modalContainer.classList.remove("hidden");
});

cancelTaskButton.addEventListener("click", () => {
    modalContainer.classList.add("hidden");
    taskForm.reset();
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask = createNewTask(formData);

    if (tasks.some(task => task.title === newTask.title)) {
        showToast("Cette tâche existe déjà ! ⚠️");
        return;
    }

    tasks.push(newTask);
    updateTaskLists();
    modalContainer.classList.add("hidden");
    taskForm.reset();
    saveTasks();
    showToast("Nouvelle tâche ajoutée ! ✨");
});

searchInput.addEventListener("input", (event) => {
    updateTaskLists(event.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-due-date').value = today;
    
    updateTaskLists();
});