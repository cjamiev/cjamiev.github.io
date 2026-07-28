let todos = loadFromLocalStorage('todos');

function init() {
  const form = document.getElementById('todoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo();
    });
  }

  const editTasksBtn = document.getElementById('edit-btn');
  if (editTasksBtn) {
    editTasksBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleEditMode();
    });
  }
}

function setupEventListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const todoId = parseInt(btn.dataset.id);
      deleteTodo(todoId);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const todoId = parseInt(btn.dataset.id);
      editTodo(todoId);
    });
  });

  document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const todoId = parseInt(btn.dataset.id);
      toggleComplete(todoId);
    });
  });
}

function addTodo() {
  const nameInput = document.getElementById('nameInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const dueDateInput = document.getElementById('dueDateInput');
  const todoId = document.getElementById('todoId');

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  const id = todoId.getAttribute('data-id');
  const isNew = !id;

  if (!name) {
    alert('Please enter a task name');
    return;
  }

  const newTodo = {
    id: Date.now(),
    name,
    description,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };

  if (isNew) {
    todos.push(newTodo);
  } else {
    todos = todos.map(t => {
      if (t.id == id) {
        return newTodo;
      } else {

        return t
      }
    });
  }

  saveTodos();
  clearForm();
  renderTodos();
  resetToView();
  setupEventListeners();
}

function clearForm() {
  document.getElementById('nameInput').value = '';
  document.getElementById('descriptionInput').value = '';
  document.getElementById('dueDateInput').value = '';
  document.getElementById('todoId').setAttribute('data-id', '');
}

function editTodo(id) {
  const matched = todos.find(t => t.id == id);

  document.getElementById('nameInput').value = matched.name;
  document.getElementById('descriptionInput').value = matched.description;
  document.getElementById('dueDateInput').value = matched.dueDate;
  document.getElementById('todoId').setAttribute('data-id', matched.id);
}

function deleteTodo(id) {
  if (confirm('Are you sure you want to delete this todo?')) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    setupEventListeners();
  }
}

function toggleComplete(id) {
  todos = todos.map(t => {
    if (t.id === id) {
      return {
        ...t,
        completed: !t.completed
      }
    }
    return t;
  });
  saveTodos();
  renderTodos();
  setupEventListeners();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function resetToView() {
  document.querySelectorAll('.delete-btn').forEach(btn => btn.classList.remove('show'));
  document.querySelectorAll('.edit-btn').forEach(btn => btn.classList.remove('show'));
  document.getElementById('edit-btn').innerHTML = 'Edit Task';
}

function toggleEditMode() {
  document.querySelectorAll('.delete-btn').forEach(btn => btn.classList.toggle('show'));
  document.querySelectorAll('.edit-btn').forEach(btn => btn.classList.toggle('show'));
  const editBtn = document.getElementById('edit-btn');
  const isClosing = editBtn.innerHTML === 'Edit Task';
  if (isClosing) {
    clearForm();
    editBtn.innerHTML = 'View';
  } else {
    editBtn.innerHTML = 'Edit Task';
  }
}

function renderTodos() {
  const container = document.getElementById('todoList');
  if (!container) return;

  container.innerHTML = '';

  if (todos.length === 0) {
    container.innerHTML = '<p class="empty-message">No tasks yet. Add one above!</p>';
    return;
  }

  const sortedTodos = [...todos].sort((a, b) => {
    // Uncompleted first, then by due date
    if (a.completed === b.completed) {
      return new Date(a.dueDate || '') - new Date(b.dueDate || '');
    }
    return a.completed ? 1 : -1;
  });

  sortedTodos.forEach(todo => {
    const todoElement = document.createElement('div');
    todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    todoElement.innerHTML = `
        <div class="todo-content">
          <h3 class="todo-name">${escapeHtml(todo.name)}</h3>
          ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
          <span class="todo-due-date">Created: ${formatDate(todo.createdAt)}</span>
          ${todo.dueDate ? `<span class="todo-due-date">Due: ${formatDate(todo.dueDate)}</span>` : ''}
        </div>
        <div class="todo-actions">
          <button class="complete-btn" data-id="${todo.id}">
            ${todo.completed ? '✓ Completed' : 'Not Complete'}
          </button>
          <button class="edit-btn" data-id="${todo.id}">Edit</button>
          <button class="delete-btn" data-id="${todo.id}">Delete</button>
        </div>
      `;
    container.appendChild(todoElement);
  });
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  init();
  setupEventListeners();
});
