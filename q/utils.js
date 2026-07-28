function copyToClipboard(content) {
  navigator.clipboard.writeText(typeof content === "object" ? JSON.stringify(content) : content);
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToLocalStorage(key, contents) {
  localStorage.setItem(key, JSON.stringify(contents));
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function flashBanner() {
  const element = document.getElementById('alert-msg');
  element.classList.add('show');

  element.animate([
    { transform: 'translateX(200%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], {
    duration: 250,
    easing: 'ease-out',
    fill: 'forwards'
  });

  setTimeout(() => {
    element.classList.remove('show');
  }, 3000);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

function backupLocalStorage() {
  const bookmarks = loadFromLocalStorage('bookmarks');
  const clipboards = loadFromLocalStorage('clipboards');
  const notes = loadFromLocalStorage('notes');
  const todos = loadFromLocalStorage('todos');

  const allItems = { bookmarks, clipboards, notes, todos };

  downloadFile('q-backup', JSON.stringify(allItems));
}