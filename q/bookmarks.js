let bookmarks = loadFromLocalStorage('bookmarks');

function saveBookmarks() {
    saveToLocalStorage('bookmarks', bookmarks);
}

function bookmarksByType(list) {
    return list.map(bookmark => `
        <li class="bookmark-item">
          <div class="favorite-star">${bookmark.isFavorite ? '&#9733;' : ''}</div>
          <div class="bookmark-info">
              <a href="${escapeHtml(bookmark.url)}" target="_blank" class="bookmark-url">
                <div class="bookmark-name">${bookmark.name}</div>
              </a>
              </div>
          ${bookmark.username ? `<button id="${bookmark.id}-username-copy-btn" class="copy-btn">Id</button>` : ''}
          ${bookmark.password ? `<button id="${bookmark.id}-password-copy-btn" class="copy-btn">P</button>` : ''}
          <button class="edit-btn" onclick="editBookmark(${bookmark.id})">E</button>
          <button class="delete-btn" onclick="deleteBookmark(${bookmark.id})">D</button>
        </li>
      `).join('');
}

function renderBookmarks(list = bookmarks) {
    const bookmarkList = document.getElementById('bookmarkList');

    if (list.length === 0) {
        bookmarkList.innerHTML = '<div class="empty-message">No bookmarks found.</div>';
        return;
    }

    const bookmarkTypes = list.map(bookmark => bookmark.type);
    const uniqueTypes = [...new Set(bookmarkTypes)];

    uniqueTypes.forEach(type => {
        const typeList = list.filter(bookmark => bookmark.type === type);
        const typeElement = document.createElement('div');
        typeElement.classList.add('type-list');
    });

    bookmarkList.innerHTML = uniqueTypes.map(type => `
        <div>
          <h2>${type}</h2>
          <ul>
            ${bookmarksByType(list.filter(bookmark => bookmark.type === type))}
          </ul>
        </div>
      `).join('');

    list.forEach(bookmarkItem => {
        if (bookmarkItem.username) {
            document.getElementById(`${bookmarkItem.id}-username-copy-btn`).onclick = () => {
                copyToClipboard(bookmarkItem.username);
                flashBanner();
            };
        }
        if (bookmarkItem.password) {
            document.getElementById(`${bookmarkItem.id}-password-copy-btn`).onclick = () => {
                copyToClipboard(bookmarkItem.password);
                flashBanner();
            };
        }
    });
}

function renderBookmarkTypes() {
    const bookmarkTypes = bookmarks.map(bookmark => bookmark.type);
    const uniqueTypes = [...new Set(bookmarkTypes)];

    document.getElementById('type-tags').innerHTML = uniqueTypes.map(type => `<button class="type-tag-btn" onclick="selectType('${type}')">${escapeHtml(type)}</button>`).join('');
}

function clearForm() {
    document.getElementById('nameInput').value = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('typeInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('bookmarkId').value = '';
    document.getElementById('isFavoriteInput').checked = false;
}

function addBookmark() {
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const typeInput = document.getElementById('typeInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const bookmarkId = document.getElementById('bookmarkId');
    const isFavoriteInput = document.getElementById('isFavoriteInput');

    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    const type = typeInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const isFavorite = isFavoriteInput.checked;
    const id = bookmarkId.getAttribute('data-id');
    const isNew = !id;

    if (!name) {
        alert('Please  enter a bookmark name!');
        return;
    }

    if (!url) {
        alert('Please enter a URL!');
        return;
    }

    // Add https:// if not present
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    const bookmark = {
        id: isNew ? Date.now() : id,
        name,
        url,
        type: type ? capitalizeFirstLetter(type) : 'Other',
        username,
        password,
        isFavorite
    };

    if (isNew) {
        bookmarks.push(bookmark);
    } else {
        bookmarks = bookmarks.map(b => {
            if (b.id == id) {
                return bookmark;
            } else {

                return b
            }
        });
    }
    saveBookmarks();

    clearForm();
    renderBookmarks();
    renderBookmarkTypes();
    resetToView();
}

function editBookmark(id) {
    showAddForm();
    const matched = bookmarks.find(b => b.id == id);

    document.getElementById('nameInput').value = matched.name;
    document.getElementById('urlInput').value = matched.url;
    document.getElementById('typeInput').value = matched.type;
    document.getElementById('usernameInput').value = matched.username;
    document.getElementById('passwordInput').value = matched.password;
    document.getElementById('isFavoriteInput').checked = matched.isFavorite;
    document.getElementById('bookmarkId').setAttribute('data-id', matched.id);
}

function deleteBookmark(id) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id != id);
        saveBookmarks();
        renderBookmarks();
        renderBookmarkTypes();
    }
}

function filterBookmarks() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    if (!searchText) {
        renderBookmarks();
        return;
    }

    const filtered = bookmarks.filter(bookmark =>
        bookmark.name.toLowerCase().includes(searchText) ||
        bookmark.url.toLowerCase().includes(searchText)
    );

    renderBookmarks(filtered);
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
    document.getElementById('bookmark-container').classList.add('show');
    document.getElementById('add-btn').innerHTML = 'Hide';
}

function toggleAddForm() {
    document.getElementById('bookmark-container').classList.toggle('show');
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

document.addEventListener('DOMContentLoaded', () => {
    renderBookmarks();
    renderBookmarkTypes();
});
