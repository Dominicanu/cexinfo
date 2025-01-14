const addBtn = document.getElementById('add-btn');
const addForm = document.getElementById('add-form');
const saveBtn = document.getElementById('save-btn');
const closeBtn = document.querySelector('.close');
const searchBar = document.getElementById('search-bar');

// Open or create the IndexedDB database
let db;
const request = indexedDB.open('codesDB', 1);

request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains('codes')) {
        db.createObjectStore('codes', { keyPath: 'number' });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;
};

request.onerror = function (e) {
    console.error('Error opening database:', e.target.errorCode);
};

// Add a code to the database
function addCode(number, code) {
    const transaction = db.transaction(['codes'], 'readwrite');
    const store = transaction.objectStore('codes');
    const request = store.add({ number, code });

    request.onsuccess = () => {
        alert('Code saved successfully!');
        addForm.style.display = 'none';
    };

    request.onerror = () => {
        alert('Error: Number already exists or another issue occurred.');
    };
}

// Search for a code in the database
function searchCode(number) {
    const transaction = db.transaction(['codes'], 'readonly');
    const store = transaction.objectStore('codes');
    const request = store.get(number);

    request.onsuccess = () => {
        if (request.result) {
            const code = request.result.code;
            navigator.clipboard.writeText(code);
            alert(`Code "${code}" copied to clipboard!`);
        } else {
            alert('Code not found.');
        }
    };

    request.onerror = () => {
        alert('Error searching for the code.');
    };
}

// Show/Hide Add Form
addBtn.addEventListener('click', () => addForm.style.display = 'block');
closeBtn.addEventListener('click', () => addForm.style.display = 'none');

// Save Button Click
saveBtn.addEventListener('click', () => {
    const number = document.getElementById('number-input').value.trim();
    const code = document.getElementById('code-input').value.trim();

    if (!number || !code) {
        alert('Please fill out all fields.');
        return;
    }

    addCode(number, code);
});

// Search on Enter Key
searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const number = searchBar.value.trim();
        if (number) {
            searchCode(number);
        } else {
            alert('Please enter a number to search.');
        }
    }
});
