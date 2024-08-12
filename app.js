document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', modifyTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
        taskInput.value = '';
    }

    function modifyTask(e) {
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(e.target);
        }
    }

    function deleteTask(button) {
        const li = button.parentElement;
        taskList.removeChild(li);
    }

    function editTask(button) {
        const li = button.parentElement;
        const taskText = li.querySelector('span').textContent;
        const newTaskText = prompt('Edit task:', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            li.querySelector('span').textContent = newTaskText.trim();
        }
    }
});
