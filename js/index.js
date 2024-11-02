// ================ SÉLECTION DES ÉLÉMENTS DU DOM ================
// Formulaire et boutons
const taskForm = document.getElementById("task-form");
const newTaskButton = document.getElementById("nouvelle-tache");
const cancelTaskButton = document.getElementById("cancel-task");
const searchInput = document.getElementById("searchInput");

// Colonnes de tâches
const todoColumn = document.getElementById("todo-column").querySelector('[data-status="À faire"]');
const progressColumn = document.getElementById("progress-column").querySelector('[data-status="En cours"]');
const doneColumn = document.getElementById("done-column").querySelector('[data-status="Terminées"]');

// Éléments de progression
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");

// Modal
const modalContainer = document.getElementById("modal-container");

// Compteurs de tâches pour chaque colonne
const todoCount = document.querySelector('#todo-column .task-count');
const progressCount = document.querySelector('#progress-column .task-count');
const doneCount = document.querySelector('#done-column .task-count');

// ================ GESTION DES TÂCHES ================
// Récupération des tâches depuis le stockage local ou création d'un tableau vide
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ================ FONCTIONS PRINCIPALES ================
// 1. Fonction pour créer une nouvelle tâche
function createNewTask(formData) {
    return {
        id: Date.now().toString(), // Identifiant unique basé sur la date
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate"),
        status: "À faire"
    };
}

// 2. Fonction pour afficher une notification
function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "bg-blue-500 text-white px-4 py-2 rounded shadow-lg";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Supprime la notification après 3 secondes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 3. Fonction pour obtenir la couleur selon la priorité
function getPriorityColor(priority) {
    switch(priority.toLowerCase()) {
        case 'haute':
            return 'border-red-500';
        case 'moyenne':
            return 'border-orange-500';
        case 'basse':
            return 'border-green-500';
        default:
            return '';
    }
}

// 4. Fonction pour créer l'élément HTML d'une tâche
function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = `${getPriorityColor(task.priority)} p-4 rounded-md mb-2 bg-white shadow-sm`;
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="font-bold text-gray-800">${task.title}</h3>
            <button class="text-gray-500 hover:text-red-500 delete-task" 
                    data-task-id="${task.id}">×</button>
        </div>
        <p class="text-gray-600 text-sm my-2">${task.description}</p>
        <div class="text-xs text-gray-500 mb-2">
            <span class="mr-2">🎯 Priorité: ${task.priority}</span>
            <span>📅 Échéance: ${new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div class="flex gap-2">
            ${task.status !== "Terminées" ? 
                `<button class="start-task text-blue-500 hover:text-blue-700 text-sm" data-task-id="${task.id}">
                    ${task.status === "À faire" ? "▶️ Commencer" : "🔄 Reprendre"}
                </button>` : ""}
            ${task.status !== "Terminées" ? 
                `<button class="complete-task text-green-500 hover:text-green-700 text-sm" data-task-id="${task.id}">
                    ✅ Terminer
                </button>` : ""}
        </div>
    `;

    // Ajout des écouteurs d'événements pour les boutons
    addTaskButtonListeners(taskElement, task.id);

    return taskElement;
}

// 5. Fonction pour ajouter les écouteurs d'événements aux boutons d'une tâche
function addTaskButtonListeners(taskElement, taskId) {
    // Bouton de suppression
    taskElement.querySelector('.delete-task')?.addEventListener('click', () => {
        deleteTask(taskId);
    });

    // Bouton de démarrage
    taskElement.querySelector('.start-task')?.addEventListener('click', () => {
        startTask(taskId);
    });

    // Bouton de complétion
    taskElement.querySelector('.complete-task')?.addEventListener('click', () => {
        completeTask(taskId);
    });
}

// 6. Fonction pour mettre à jour l'affichage des tâches
function updateTaskLists(searchFilter = '') {
    // Filtrer les tâches selon la recherche
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Vider les colonnes
    todoColumn.innerHTML = "";
    progressColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    // Variables pour les statistiques
    let totalTasks = filteredTasks.length;
    let completedTasks = 0;

    // Distribuer les tâches dans les colonnes
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

    // Mettre à jour les compteurs
    updateCounters(filteredTasks);
    // Mettre à jour la barre de progression
    updateProgress(completedTasks, totalTasks);
}

// 7. Fonction pour mettre à jour les compteurs
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

// 8. Fonction pour mettre à jour la barre de progression
function updateProgress(completed, total) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressText.textContent = `${completed} tâche${completed > 1 ? 's' : ''} terminée${completed > 1 ? 's' : ''}`;
    progressPercentage.textContent = `${percentage.toFixed(0)}%`;
    progressBar.style.width = `${percentage}%`;
}

// ================ FONCTIONS DE GESTION DES TÂCHES ================
// 1. Démarrer une tâche
function startTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = "En cours";
        saveTasks();
        updateTaskLists();
        showToast("Tâche démarrée ! 🚀");
    }
}

// 2. Terminer une tâche
function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = "Terminées";
        saveTasks();
        updateTaskLists();
        showToast("Tâche terminée ! 🎉");
    }
}

// 3. Supprimer une tâche
function deleteTask(taskId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        updateTaskLists();
        showToast("Tâche supprimée ! 🗑️");
    }
}

// 4. Sauvegarder les tâches
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ================ ÉCOUTEURS D'ÉVÉNEMENTS ================
// 1. Ouverture du modal
newTaskButton.addEventListener("click", () => {
    modalContainer.classList.remove("hidden");
});

// 2. Fermeture du modal
cancelTaskButton.addEventListener("click", () => {
    modalContainer.classList.add("hidden");
    taskForm.reset();
});

// 3. Soumission du formulaire
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask = createNewTask(formData);

    // Vérifier si la tâche existe déjà
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

// 4. Recherche de tâches
searchInput.addEventListener("input", (event) => {
    updateTaskLists(event.target.value);
});

// 5. Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    // Définir la date du jour comme date par défaut
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-due-date').value = today;
    
    // Charger et afficher les tâches
    updateTaskLists();
});