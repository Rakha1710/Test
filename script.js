document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render existing tasks
    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const todoItem = createTodoItem(task, index);
            todoList.appendChild(todoItem);
        });
    }

    // Create new todo item
    function createTodoItem(task, index) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.draggable = true;
        todoItem.dataset.index = index;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const text = document.createElement('span');
        text.textContent = task.text;

        todoItem.appendChild(checkbox);
        todoItem.appendChild(text);

        if (task.completed) {
            todoItem.classList.add('completed');
        }

        // Drag and drop event listeners
        todoItem.addEventListener('dragstart', handleDragStart);
        todoItem.addEventListener('dragend', handleDragEnd);
        todoItem.addEventListener('dragover', handleDragOver);
        todoItem.addEventListener('drop', handleDrop);

        return todoItem;
    }

    // Add new task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            todoInput.value = '';
        }
    });

    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Drag and drop functionality
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (this === draggedItem) return;

        const draggedIndex = parseInt(draggedItem.dataset.index);
        const droppedIndex = parseInt(this.dataset.index);

        // Reorder tasks array
        const temp = tasks[draggedIndex];
        tasks[draggedIndex] = tasks[droppedIndex];
        tasks[droppedIndex] = temp;

        saveTasks();
        renderTasks();
    }

    // Initial render
    renderTasks();
});