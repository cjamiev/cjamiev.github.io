let notes = loadFromLocalStorage('notes');

function copyNotes() {
    copyToNote(notes);
    flashBanner();
}

// Save notes to localStorage
function saveNotes() {
    saveToLocalStorage('notes', notes);
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

function notesByType(list) {
    return list.map(note => `
        <li class="note-item">
          <div class="note-info">              
            <button id="${note.id}-edit-btn" class="select-btn">${note.name}</button>
          </div>
        </li>
      `).join('');
}

function renderNotes(list = notes) {
    const noteList = document.getElementById('noteList');

    if (list.length === 0) {
        noteList.innerHTML = '<div class="empty-message">No notes found. </div>';
        return;
    }

    const noteTypes = list.map(note => note.type);
    const uniqueTypes = [...new Set(noteTypes)];

    uniqueTypes.forEach(type => {
        const typeList = list.filter(note => note.type === type);
        const typeElement = document.createElement('div');
        typeElement.classList.add('type-list');
    });

    noteList.innerHTML = uniqueTypes.map(type => `
        <div>
          <h2>${type}</h2>
          <ul>
            ${notesByType(list.filter(note => note.type === type))}
          </ul>
        </div>
      `).join('');

    // Attach the click event separately 
    list.forEach(noteItem => {
        document.getElementById(`${noteItem.id}-edit-btn`).onclick = () => {
            editNote(noteItem.id);
        };
    });
}

function renderNoteTypes() {
    const noteTypes = notes.map(note => note.type);
    const uniqueTypes = [...new Set(noteTypes)];

    document.getElementById('type-tags').innerHTML = uniqueTypes.map(type => `<button class="type-tag-btn" onclick="selectType('${type}')">${escapeHtml(type)}</button>`).join('');
}

function clearForm() {
    document.getElementById('nameInput').value = '';
    document.getElementById('valueInput').value = '';
    document.getElementById('typeInput').value = '';
    document.getElementById('noteId').setAttribute('data-id', '');
}

function addNote() {
    const nameInput = document.getElementById('nameInput');
    const valueInput = document.getElementById('valueInput');
    const typeInput = document.getElementById('typeInput');
    const noteId = document.getElementById('noteId');

    const name = nameInput.value.trim();
    const value = valueInput.value.trim();
    const type = typeInput.value.trim();
    const id = noteId.getAttribute('data-id');
    const isNew = !id;

    if (!name) {
        alert('Please  enter a note name!');
        return;
    }

    const note = {
        id: isNew ? Date.now() : id,
        name,
        value,
        type: type ? capitalizeFirstLetter(type) : 'Other',
        updatedAt: Date.now()
    };

    if (isNew) {
        notes.push(note);
    } else {
        notes = notes.map(c => {
            if (c.id == id) {
                return note;
            } else {

                return c
            }
        });
    }
    saveNotes();

    renderNotes();
    renderNoteTypes();
}

function editNote(id) {
    const matched = notes.find(c => c.id == id);

    document.getElementById('display-name').innerHTML = matched.name;
    document.getElementById('display-date').innerHTML = 'Last Updated ' + formatDate(matched.updatedAt);
    document.getElementById('nameInput').value = matched.name;
    document.getElementById('valueInput').value = matched.value;
    document.getElementById('typeInput').value = matched.type;
    document.getElementById('noteId').setAttribute('data-id', matched.id);
}

function deleteNote() {
    const id = document.getElementById('noteId').getAttribute('data-id');
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id != id);
        saveNotes();
        renderNotes();
        renderNoteTypes();
    }
}

// Filter notes by search text
function filterNotes() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    if (!searchText) {
        renderNotes();
        return;
    }

    const filtered = notes.filter(note => note.name.toLowerCase().includes(searchText)
    );

    renderNotes(filtered);
}

function selectType(type) {
    document.getElementById('typeInput').value = type.trim();
}

function selectLatest() {
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

    editNote(sortedNotes[0].id);
}

function showCreateModal() {
    document.getElementById('nameInput').value = '';
    document.getElementById('valueInput').value = '';
    document.getElementById('typeInput').value = '';
    document.getElementById('noteId').setAttribute('data-id', '');

    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('modalOverlay');

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function showEditModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('modalOverlay');

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function hideCreateModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('modalOverlay');

    modal.style.display = 'none';
    overlay.style.display = 'none';
}

function createNewNote() {
    addNote()
    hideCreateModal();
    selectLatest();
}

// Load notes on page load
document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
    renderNoteTypes();
    selectLatest();
});
