/**
 * 🛠 THE GRAND ARCHIVE - ADMIN DASHBOARD LOGIC (admin.js)
 * ==========================================================
 * This script handles all administrative functions for the 
 * Library's control room. It allows managers to:
 * 1. Monitor registered scholars (Students/Staff).
 * 2. Add or Remove volumes from the Archive collection.
 * 3. Update stock levels and book details.
 */

// --- 1. CONFIGURATION ---
const API_PATH = 'backend-api.php'; // Renamed from api.php

// --- 2. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    /**
     * When the dashboard loads, we immediately fetch the 
     * latest data from the vault.
     */
    loadUsers();
    loadBooks();

    // Setup form submission listener for adding books
    const addBookForm = document.getElementById('add-book-form-element');
    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addBook();
        });
    }
});

/**
 * 📂 Function: showTab
 * Purpose: Switches between the 'Members' and 'Volumes' views in the dashboard.
 */
function showTab(tabId) {
    // Hide all sections and deactivate all buttons
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show the requested section and activate the button
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

/**
 * 👥 Function: loadUsers
 * Purpose: Retrieves a list of everyone registered in the archive.
 */
async function loadUsers() {
    try {
        const response = await fetch(`${API_PATH}?action=get_users`);
        const result = await response.json();

        if (result.success) {
            const tbody = document.querySelector('#users-table tbody');
            tbody.innerHTML = ''; // Start with a fresh table

            result.users.forEach(u => {
                const tr = document.createElement('tr');
                // Build a row for each member
                tr.innerHTML = `
                    <td>${u.id_no}</td>
                    <td>${u.full_name}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role==='admin'?'bg-primary':'bg-secondary'}">${u.role.toUpperCase()}</span></td>
                    <td class="text-center">
                        <button class="btn-premium-action btn-delete" onclick="deleteUser(${u.id})">Expel</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error("Archive connection failed while loading members:", err);
    }
}

/**
 * 🚮 Function: deleteUser
 * Purpose: Removes a scholar's record from the database.
 */
async function deleteUser(id) {
    if (!confirm('Are you sure you want to permanently remove this scholar from the records?')) return;
    
    try {
        const response = await fetch(`${API_PATH}?action=delete_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        });
        const result = await response.json();
        if (result.success) {
            loadUsers(); // Refresh the list
        }
    } catch (err) {
        console.error("Removal failed:", err);
    }
}

/**
 * 📚 Function: loadBooks
 * Purpose: Loads all books in the collection for management.
 */
async function loadBooks() {
    try {
        const response = await fetch(`${API_PATH}?action=load`);
        const result = await response.json();

        if (result.success) {
            const tbody = document.querySelector('#books-table tbody');
            tbody.innerHTML = ''; 
            
            if (result.books && result.books.length > 0) {
                result.books.forEach(b => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${b.id}</td>
                        <td class="fw-bold">${b.title}</td>
                        <td>${b.author}</td>
                        <td class="${b.stock===0?'text-danger':''}">${b.stock} units</td>
                        <td class="text-center">
                            <button class="btn-premium-action btn-delete" onclick="deleteBook(${b.id})">Incinerate</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">The shelves are currently empty.</td></tr>';
            }
        }
    } catch (err) {
        console.error("Archive connection failed while loading volumes:", err);
    }
}

/**
 * ➕ Function: addBook
 * Purpose: Submits a new book entry to the vault.
 */
async function addBook() {
    const book = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        genre: document.getElementById('book-genre').value,
        stock: parseInt(document.getElementById('book-stock').value),
        image: document.getElementById('book-image').value || 'img/default.jpg',
        summary: document.getElementById('book-summary').value
    };

    try {
        const response = await fetch(`${API_PATH}?action=add_book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });

        const result = await response.json();
        if (result.success) {
            alert("The record has been added to the Grand Catalog.");
            toggleBookForm();      // Hide form
            loadBooks();           // Refresh list
            document.getElementById('add-book-form-element').reset(); // Clear inputs
        } else {
            alert("Vault Error: " + result.error);
        }
    } catch (err) {
        console.error("Archival submission failed:", err);
    }
}

/**
 * 🗑 Function: deleteBook
 * Purpose: Removes a book record from the collection.
 */
async function deleteBook(id) {
    if (!confirm('This action will strike this volume from history. Proceed?')) return;
    try {
        const response = await fetch(`${API_PATH}?action=delete_book&id=${id}`);
        const result = await response.json();
        if (result.success) {
            loadBooks();
        } else {
            alert("Incineration failed: " + result.error);
        }
    } catch (err) {
        console.error("Connection lost:", err);
    }
}

/**
 * 📑 UI: toggleBookForm
 * Purpose: Slides the "Add New Book" form in and out.
 */
function toggleBookForm() {
    const form = document.getElementById('add-book-form');
    if (!form) return;
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}
