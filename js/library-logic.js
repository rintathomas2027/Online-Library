/**
 * 📚 THE GRAND ARCHIVE - LIBRARY ENGINE (library-logic.js)
 * ==========================================================
 * This script is the core "Brain" of the library interface. 
 * It manages book discovery, user authentication UI, 
 * and the book reservation system.
 */

// --- 1. CONFIGURATION & CONSTANTS ---
const RESERVED_KEY = 'library_reserved_v1';
const RESERVATIONS_KEY = 'library_reservations_v1';
const API_PATH = 'backend-api.php'; // Renamed from api.php

// --- 2. GLOBAL STATE ---
let filteredBooks = [];
let totalBooks = 0;
let currentPage = 1;
let booksPerPage = 6;
let reservedCount = 0;
let reservations = []; 
let pendingReserveId = null;

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 🎭 Trigger the cinematic entrance
    triggerEntranceMotion();
    
    // 👤 Check if the scholar is logged in to show profile icons
    checkAuthStatus();
    
    // 💾 Load local cart memory
    loadFromStorage();
    
    // 🛠 Setup UI components
    populateGenreSelect();
    updateStats();
    renderCartPanel();
    
    // 🖱 Bind global click events for the profile card
    const closeBtn = document.getElementById('closeProfile');
    const backdrop = document.getElementById('blurBackdrop');
    const logoutBtnMain = document.getElementById('logoutBtnMain');
    
    if (closeBtn) closeBtn.addEventListener('click', closeProfileOverlay);
    if (backdrop) backdrop.addEventListener('click', closeProfileOverlay);
    if (logoutBtnMain) logoutBtnMain.addEventListener('click', handleLogout);

    // 🔍 Setup Search Input
    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) {
        searchInputEl.addEventListener('input', () => {
            updateSuggestions();
            applyFilters();
        });
        searchInputEl.addEventListener('blur', () => {
            setTimeout(() => { if (document.getElementById('suggestions')) document.getElementById('suggestions').hidden = true; }, 150);
        });
        searchInputEl.addEventListener('focus', updateSuggestions);
    }
});

/**
 * 💾 Function: loadFromStorage
 * Purpose: Gets saved reservations from browser memory.
 */
function loadFromStorage() {
    try {
        const rawRes = localStorage.getItem(RESERVATIONS_KEY);
        reservations = rawRes ? JSON.parse(rawRes) : [];
        
        const rawCount = localStorage.getItem(RESERVED_KEY);
        reservedCount = rawCount ? Number(rawCount) : 0;
    } catch (e) {
        console.warn("Storage access failed", e);
    }
    fetchLibraryData();
}

/**
 * 🌐 Function: fetchLibraryData
 * Purpose: Asks the backend server for books based on current filters.
 */
function fetchLibraryData() {
    const searchInput = document.getElementById('searchInput');
    const genreSelect = document.getElementById('genreSelect');
    const keyword = searchInput ? searchInput.value.trim() : '';
    const selectedGenre = genreSelect ? genreSelect.value : 'All';

    const params = new URLSearchParams({
        action: 'load',
        page: currentPage,
        limit: booksPerPage,
        q: keyword,
        genre: selectedGenre
    });

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_PATH}?${params.toString()}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {
                    filteredBooks = data.books;
                    totalBooks = data.totalBooks || 0;
                    displayBooks();
                    updateStats();
                }
            } catch (error) { console.error("API Response Error:", error); }
        }
    };
    xhr.send();
}

/**
 * 🖼 Function: displayBooks
 * Purpose: Renders the book cards in the grid.
 */
function displayBooks() {
    const container = document.getElementById("bookContainer");
    if (!container) return;

    container.innerHTML = ""; 

    if (!filteredBooks || filteredBooks.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5 reveal-item is-visible">
                <h3 style="color: #c5a059;">No records found in the Great Vault.</h3>
            </div>`;
        createPagination();
        return;
    }

    filteredBooks.forEach(book => {
        const col = document.createElement('div');
        col.className = 'col reveal-item';

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-img-container" style="height: 240px; background: #12100e; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <img src="${book.image || 'img/placeholder.jpg'}" class="card-img-top w-100 h-100" style="object-fit:contain; padding:10px;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text text-muted mb-2">${book.author}</p>
                    <p class="mb-3">
                        ${book.stock === 0 ? '<span class="badge bg-secondary">Out of Circulation</span>' : 
                          book.stock <= 2 ? `<span class="badge bg-warning text-dark">Rare Piece: ${book.stock} left</span>` :
                          `<span class="badge bg-success">In Collection: ${book.stock}</span>`}
                    </p>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100" onclick="handleReserveBtnClick(${book.id}, ${book.stock})">
                            ${isLoggedIn ? 'Acquire Tome' : 'Scholar Benefit'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        col.querySelector('.card-img-container').onclick = () => showBookInfo(book);
        container.appendChild(col);
        setTimeout(() => col.classList.add('is-visible'), 50);
    });

    createPagination();
}

/**
 * 🖱 Function: handleReserveBtnClick
 * Purpose: Decides whether to show reservation modal or prompt login.
 */
function handleReserveBtnClick(id, stock) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        promptLogin();
        return;
    }
    if (stock > 0) reserveBook(id);
}

/**
 * 🚪 Function: promptLogin
 * Purpose: Forces user to login if they try to reserve as a guest.
 */
function promptLogin() {
    showToast('Please authenticate as a Scholar to reserve volumes.', 'info');
    setTimeout(() => window.location.href = 'login.php', 1500);
}

/**
 * 🏷 Function: populateGenreSelect
 * Purpose: Populates the filter dropdown.
 */
function populateGenreSelect() {
    const genres = ["Biography", "Fantasy", "Geography", "History", "Language", "Music", "Non-fiction", "Survival fiction"];
    const select = document.getElementById('genreSelect');
    if (!select) return;

    select.innerHTML = '<option value="All">All Genres</option>' +
        genres.map(g => `<option value="${g}">${g}</option>`).join('');
    
    select.onchange = () => { applyFilters(); };
}

function applyFilters() {
    currentPage = 1; 
    fetchLibraryData();
}

/**
 * 📄 Function: createPagination
 * Purpose: Generates the page numbers.
 */
function createPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    if (totalPages <= 1) return;

    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item' + (i === currentPage ? ' active' : '');
        const btn = document.createElement('button');
        btn.className = 'page-link';
        btn.innerText = i;
        btn.onclick = () => {
            if (currentPage === i) return;
            const cont = document.getElementById("bookContainer");
            cont.classList.add('rolling-pillar');
            setTimeout(() => {
                currentPage = i;
                fetchLibraryData();
                window.scrollTo({ top: 300, behavior: 'smooth' });
                setTimeout(() => cont.classList.remove('rolling-pillar'), 400);
            }, 400);
        };
        li.appendChild(btn);
        ul.appendChild(li);
    }
    pagination.appendChild(ul);
}

/**
 * ⚙️ RESERVATION SYSTEM LOGIC
 */
function reserveBook(id) {
    const book = filteredBooks.find(b => b.id === id);
    if (!book) return;

    pendingReserveId = id;
    const modalEl = document.getElementById('reserveModal');
    const daysSel = document.getElementById('reserveDays');
    if (!modalEl || !daysSel) return;

    document.getElementById('reserveBookName').innerText = `Reserve "${book.title}" (Max 15 days):`;
    daysSel.innerHTML = Array.from({ length: 15 }, (_, i) => `<option value="${i + 1}">${i + 1} day${i + 1 > 1 ? 's' : ''}</option>`).join('');
    daysSel.value = '7';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
}

function confirmReserveHandler() {
    const days = document.getElementById('reserveDays').value;
    const book = filteredBooks.find(b => b.id === pendingReserveId);
    if (!book) return;

    if (reservations.find(r => r.id === book.id)) {
        showToast('You already have this volume in your temporary collection.', 'info');
        bootstrap.Modal.getInstance(document.getElementById('reserveModal')).hide();
        return;
    }

    const due = new Date();
    due.setDate(due.getDate() + parseInt(days));
    reservations.push({ 
        id: book.id, 
        title: book.title, 
        dueDate: due.toISOString().split('T')[0], 
        qty: 1 
    });

    if (book.stock > 0) book.stock--;
    reservedCount++;

    saveToStorage();
    displayBooks();
    updateStats();
    renderCartPanel();
    bootstrap.Modal.getInstance(document.getElementById('reserveModal')).hide();
}

function saveToStorage() {
    localStorage.setItem(RESERVED_KEY, String(reservedCount));
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

function renderCartPanel() {
    const listEl = document.getElementById('cartList');
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = String(reservedCount);
    if (!listEl) return;

    listEl.innerHTML = reservations.length === 0 ? '<p class="text-muted text-center py-4">Your collection is empty.</p>' : '';
    reservations.forEach(r => {
        const item = document.createElement('div');
        item.className = 'cart-item mb-3 p-3 border-bottom';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${r.title}</strong>
                    <small class="d-block text-accent">Return Date: ${r.dueDate}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="cancelReservation(${r.id})">Release</button>
            </div>`;
        listEl.appendChild(item);
    });
}

function cancelReservation(id) {
    const idx = reservations.findIndex(r => r.id === id);
    if (idx === -1) return;

    if (confirm(`Release "${reservations[idx].title}" back to the Archive?`)) {
        const book = filteredBooks.find(b => b.id === id);
        if (book) book.stock++;
        
        reservations.splice(idx, 1);
        reservedCount = Math.max(0, reservedCount - 1);
        
        saveToStorage();
        displayBooks();
        updateStats();
        renderCartPanel();
    }
}

/**
 * 👤 AUTHENTICATION & PROFILE LOGIC
 */
function checkAuthStatus() {
    const authArea = document.getElementById('authArea');
    const cartBtn = document.getElementById('cartBtn');
    if (!authArea) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        authArea.innerHTML = `
            <button id="profileOpenBtn" class="profile-toggle-btn reveal-item" title="Scholar Profile">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>`;
        document.getElementById('profileOpenBtn').onclick = openProfileOverlay;
        if (cartBtn) cartBtn.style.display = 'flex';
    } else {
        authArea.innerHTML = `<button onclick="window.location.href='login.php'" class="btn btn-archival-logout reveal-item">Scholar Login</button>`;
        if (cartBtn) cartBtn.style.display = 'none';
    }
}

function handleLogout() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_PATH}?action=logout`, true);
    xhr.send();
    localStorage.clear();
    window.location.reload();
}

function openProfileOverlay() {
    const overlay = document.getElementById('profileOverlay');
    const backdrop = document.getElementById('blurBackdrop');
    if (!overlay || !backdrop) return;

    document.getElementById('profileNameDisplay').innerText = localStorage.getItem('userName') || 'Scholar of Archive';
    document.getElementById('profileIdDisplay').innerText = localStorage.getItem('userIdNo') || 'Guest-000';
    document.getElementById('profileRoleDisplay').innerText = (localStorage.getItem('userRole') === 'admin') ? 'ADMIN MEMBER' : 'STUDENT MEMBER';

    overlay.classList.add('is-active');
    backdrop.classList.add('is-active');
}

function closeProfileOverlay() {
    document.getElementById('profileOverlay').classList.remove('is-active');
    document.getElementById('blurBackdrop').classList.remove('is-active');
}

/**
 * 🔍 SEARCH SUGGESTIONS
 */
function updateSuggestions() {
    const input = document.getElementById('searchInput');
    const list = document.getElementById('suggestions');
    if (!input || !list) return;

    const keyword = input.value.trim();
    if (!keyword) { list.hidden = true; return; }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_PATH}?action=load&q=${encodeURIComponent(keyword.toLowerCase())}&limit=8`, false);
    xhr.send();
    
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const matches = data.books || [];
        list.innerHTML = '';
        if (matches.length === 0) {
            list.innerHTML = '<li class="no-result">No records found</li>';
        } else {
            matches.forEach(b => {
                const li = document.createElement('li');
                li.innerText = b.title;
                li.onclick = () => { input.value = b.title; applyFilters(); list.hidden = true; };
                list.appendChild(li);
            });
        }
        list.hidden = false;
    }
}

/**
 * 🎭 UI UTILITIES
 */
function triggerEntranceMotion() {
    document.body.classList.add('is-ready');
    document.querySelectorAll('.reveal-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), 300 + (i * 100));
    });
}

function showBookInfo(book) {
    const modal = document.getElementById('bookInfoModal');
    if (!modal) return;
    document.getElementById('infoBookImg').src = book.image || 'img/placeholder.jpg';
    document.getElementById('infoBookTitle').innerText = book.title;
    document.getElementById('infoBookAuthor').innerText = book.author;
    document.getElementById('infoBookGenre').innerText = book.genre || 'Uncategorized';
    document.getElementById('infoBookSummary').innerText = book.summary || 'Summary is currently being transcribed...';
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function updateStats() {
    const t = document.getElementById("totalBooks");
    const r = document.getElementById("reservedCount");
    if (t) t.innerText = `Total Records: ${totalBooks}`;
    if (r) r.innerText = `Reserved: ${reservedCount}`;
}

function showToast(msg, type='info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast show ${type}`;
    t.innerText = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}
