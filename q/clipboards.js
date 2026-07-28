// Initialize clipboards from localStorage or empty array
let clipboards = loadFromLocalStorage('clipboards');

function copyClipboards() {
    copyToClipboard(clipboards);
    flashBanner();
}

// Save clipboards to localStorage
function saveClipboards() {
    saveToLocalStorage('clipboards', clipboards);
}

function hideModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('modalOverlay');

    modal.style.display = 'none';
    overlay.style.display = 'none';
}

function showModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('modalOverlay');

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function viewClipboard(id) {
    showModal();
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const selectedClipboard = clipboards.find(clipboard => clipboard.id === id);

    modalTitle.innerHTML = selectedClipboard.name;
    modalContent.innerHTML = selectedClipboard.value;
}

function clipboardsByType(list) {
    return list.map(clipboard => `
        <li class="clipboard-item">
          <div class="favorite-star">${clipboard.isFavorite ? '&#9733;' : ''}</div>
          <div class="clipboard-info">              
            <button id="${clipboard.id}-copy-btn" class="copy-btn">${clipboard.name}</button>
            <button class="view-btn" onclick="viewClipboard(${clipboard.id})">V</button>
          </div>
          <button class="edit-btn" onclick="editClipboard(${clipboard.id})">E</button>
          <button class="delete-btn" onclick="deleteClipboard(${clipboard.id})">D</button>
        </li>
      `).join('');
}

// Render clipboards to the list
function renderClipboards(list = clipboards) {
    const clipboardList = document.getElementById('clipboardList');

    if (list.length === 0) {
        clipboardList.innerHTML = '<div class="empty-message">No clipboards found. </div>';
        return;
    }

    const clipboardTypes = list.map(clipboard => clipboard.type);
    const uniqueTypes = [...new Set(clipboardTypes)];

    uniqueTypes.forEach(type => {
        const typeList = list.filter(clipboard => clipboard.type === type);
        const typeElement = document.createElement('div');
        typeElement.classList.add('type-list');
    });

    clipboardList.innerHTML = uniqueTypes.map(type => `
        <div>
          <h2>${type}</h2>
          <ul>
            ${clipboardsByType(list.filter(clipboard => clipboard.type === type))}
          </ul>
        </div>
      `).join('');

    // Attach the click event separately 
    list.forEach(clipItem => {
        document.getElementById(`${clipItem.id}-copy-btn`).onclick = () => {
            copyToClipboard(clipItem.value);
            flashBanner();
        };
    });
}

function renderClipboardTypes() {
    const clipboardTypes = clipboards.map(clipboard => clipboard.type);
    const uniqueTypes = [...new Set(clipboardTypes)];

    document.getElementById('type-tags').innerHTML = uniqueTypes.map(type => `<button class="type-tag-btn" onclick="selectType('${type}')">${escapeHtml(type)}</button>`).join('');
}

function clearForm() {
    document.getElementById('nameInput').value = '';
    document.getElementById('valueInput').value = '';
    document.getElementById('typeInput').value = '';
    document.getElementById('clipboardId').setAttribute('data-id', '');
    document.getElementById('isFavoriteInput').checked = false;
}

// Add a new clipboard
function addClipboard() {
    const nameInput = document.getElementById('nameInput');
    const valueInput = document.getElementById('valueInput');
    const typeInput = document.getElementById('typeInput');
    const clipboardId = document.getElementById('clipboardId');
    const isFavoriteInput = document.getElementById('isFavoriteInput');

    const name = nameInput.value.trim();
    let value = valueInput.value.trim();
    const type = typeInput.value.trim();
    const isFavorite = isFavoriteInput.checked;
    const id = clipboardId.getAttribute('data-id');
    const isNew = !id;

    if (!name) {
        alert('Please  enter a clipboard name!');
        return;
    }

    if (!value) {
        alert('Please enter a value!');
        return;
    }

    const clipboard = {
        id: Date.now(),
        name,
        value,
        type: type ? capitalizeFirstLetter(type) : 'Other',
        isFavorite
    };

    if (isNew) {
        clipboards.push(clipboard);
    } else {
        clipboards = clipboards.map(c => {
            if (c.id == id) {
                return clipboard;
            } else {

                return c
            }
        });
    }
    saveClipboards();

    // Clear inputs
    clearForm();
    renderClipboards();
    renderClipboardTypes();
    resetToView();
}

function editClipboard(id) {
    showAddForm();
    const matched = clipboards.find(c => c.id == id);

    document.getElementById('nameInput').value = matched.name;
    document.getElementById('valueInput').value = matched.value;
    document.getElementById('typeInput').value = matched.type;
    document.getElementById('isFavoriteInput').checked = matched.isFavorite;
    document.getElementById('clipboardId').setAttribute('data-id', matched.id);
}

// Delete a clipboard
function deleteClipboard(id) {
    if (confirm('Are you sure you want to delete this clipboard?')) {
        clipboards = clipboards.filter(clipboard => clipboard.id !== id);
        saveClipboards();
        renderClipboards();
        renderClipboardTypes();
    }
}

// Filter clipboards by search text
function filterClipboards() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    if (!searchText) {
        renderClipboards();
        return;
    }

    const filtered = clipboards.filter(clipboard =>
        clipboard.name.toLowerCase().includes(searchText) ||
        clipboard.url.toLowerCase().includes(searchText)
    );

    renderClipboards(filtered);
}

function resetToView() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.classList.remove('show'));
    document.querySelectorAll('.edit-btn').forEach(btn => btn.classList.remove('show'));
    document.getElementById('edit-btn').innerHTML = 'Edit';
}

function toggleEditMode() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.classList.toggle('show'));
    document.querySelectorAll('.edit-btn').forEach(btn => btn.classList.toggle('show'));
    const editBtn = document.getElementById('edit-btn');
    const isClosing = editBtn.innerHTML === 'Edit';
    if (isClosing) {
        clearForm();
        editBtn.innerHTML = 'View';
    } else {
        editBtn.innerHTML = 'Edit';
    }
}

function showAddForm() {
    document.getElementById('clipboard-container').classList.add('show');
    document.getElementById('add-btn').innerHTML = 'Hide';
}

function toggleAddForm() {
    document.getElementById('clipboard-container').classList.toggle('show');
    const addBtn = document.getElementById('add-btn');
    const isClosing = addBtn.innerHTML === 'Add';
    if (isClosing) {
        clearForm();
        addBtn.innerHTML = 'Hide';
    } else {
        addBtn.innerHTML = 'Add';
    }
}

function selectType(type) {
    document.getElementById('typeInput').value = type.trim();
}

// Load clipboards on page load
document.addEventListener('DOMContentLoaded', () => {
    renderClipboards();
    renderClipboardTypes();
});
