import config from './config.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Selectors for modal, task list, and filter elements
    const taskList = document.querySelector(".task-list");
    const addTaskBtn = document.getElementById("add-task-btn");
    const addTaskModal = document.querySelector(".modal");
    const closeModalBtn = document.querySelector(".close");
    const searchInput = document.getElementById("search-input");
    const filterPriority = document.getElementById("filter-priority");
    const filterStatus = document.getElementById("filter-status");
    const filterDue = document.getElementById("filter-due");

    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("You are not logged in. Redirecting to login...");
        window.location.href = "/login";
        return;
    }

    // Fetch tasks from backend
    let tasks = [];
    try {
        const response = await fetch(`${config.apiUrl}/api/tasks`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tasks. Please log in again.");
        }

        tasks = await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Session expired or invalid token. Redirecting to login...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
    }

    // Render tasks dynamically
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = ""; // Clear current tasks
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<p>No tasks found.</p>`;
            return;
        }
        filteredTasks.forEach(task => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");

            const statusClass = task.status === "Completed" ? "completed" : "pending";

            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p>Deadline: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <div class="priority">Priority: <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span></div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="complete-btn ${statusClass}" onclick="markAsCompleted(${task.id})">${task.status === "Completed" ? "Completed" : "Mark as Completed"}</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    // Filter and search functionality
    function applyFilters() {
        let filteredTasks = tasks;

        const searchText = searchInput.value.toLowerCase();
        if (searchText) {
            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchText));
        }

        const priorityFilter = filterPriority.value;
        if (priorityFilter !== "All") {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        const statusFilter = filterStatus.value;
        if (statusFilter !== "All") {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }

        const dueFilter = filterDue.value;
        if (dueFilter) {
            filteredTasks = filteredTasks.filter(task => new Date(task.dueDate).toISOString().split('T')[0] === dueFilter);
        }

        renderTasks(filteredTasks);
    }

    searchInput.addEventListener("input", applyFilters);
    filterPriority.addEventListener("change", applyFilters);
    filterStatus.addEventListener("change", applyFilters);
    filterDue.addEventListener("change", applyFilters);

    // Add task modal functionality
    addTaskBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);

    function openModal() {
        addTaskModal.style.display = "flex";
        addTaskModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>Add New Task</h2>
                <form id="add-task-form">
                    <label for="title">Task Title</label>
                    <input type="text" id="title" required>
                    
                    <label for="dueDate">Due Date</label>
                    <input type="date" id="dueDate" required>
                    
                    <label for="priority">Priority</label>
                    <select id="priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    
                    <button type="submit">Add Task</button>
                </form>
            </div>
        `;

        document.getElementById("add-task-form").addEventListener("submit", addTask);
    }

    function closeModal() {
        addTaskModal.style.display = "none";
    }

    async function addTask(event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;

        try {
            const response = await fetch(`${config.apiUrl}/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, dueDate, priority, status: "Pending" }),
            });

            if (!response.ok) {
                throw new Error("Failed to add task. Please try again.");
            }

            const newTask = await response.json();
            tasks.push(newTask);
            renderTasks();
            closeModal();
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Could not add task. Please try again.");
        }
    }

    // Mark a task as completed
    window.markAsCompleted = async function (id) {
        try {
            const response = await fetch(`${config.apiUrl}/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "Completed" }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task status.");
            }

            const updatedTask = await response.json();
            const taskIndex = tasks.findIndex(t => t.id === id);
            tasks[taskIndex] = updatedTask;
            renderTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    // Delete a task
    window.deleteTask = async function (id) {
        try {
            const response = await fetch(`${config.apiUrl}/api/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to delete task.");
            }

            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Initial render of tasks
    renderTasks();
});
