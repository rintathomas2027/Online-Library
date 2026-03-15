<!-- 
  📑 THE GRAND ARCHIVE - MODAL COMPONENTS
  ==========================================================
  This file contains the hidden overlays and pop-ups used 
  across the Library interface. It is included in library.php.
-->

<!-- 1. BOOK INFO MODAL: Shows the summary of a volume -->
<div class="modal fade" id="bookInfoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content archival-modal">
            <div class="modal-body p-0">
                <div class="row g-0">
                    <div class="col-md-5">
                        <img id="infoBookImg" src="" class="img-fluid h-100 w-100" style="object-fit: contain; background: #000; padding: 20px;">
                    </div>
                    <div class="col-md-7 p-4">
                        <button type="button" class="btn-close btn-close-white float-end" data-bs-dismiss="modal"></button>
                        <h2 id="infoBookTitle" class="archival-main-title mb-1">Book Title</h2>
                        <h5 id="infoBookAuthor" class="text-secondary mb-3">By Author</h5>
                        <p class="badge bg-primary mb-3" id="infoBookGenre">Genre</p>
                        <hr class="border-secondary">
                        <p id="infoBookSummary" class="text-light archival-summary-text">Summary text goes here...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 2. RESERVE MODAL: Days selection for borrowing -->
<div class="modal fade" id="reserveModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content archival-modal p-4">
            <h3 id="reserveBookName" class="archival-main-title mb-4">Acquire Volume</h3>
            <div class="mb-4">
                <label class="form-label text-secondary">Duration (Days)</label>
                <select id="reserveDays" class="form-select archival-select-sm"></select>
            </div>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary flex-grow-1" onclick="confirmReserveHandler()">Confirm Reservation</button>
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!-- 3. PROFILE OVERLAY: The Scholar Card -->
<div id="profileOverlay" class="scholar-profile-card">
    <div class="profile-header text-center">
        <div class="avatar-circle">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="var(--accent-gold)">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </div>
        <h3 id="profileNameDisplay" class="mt-3">Scholar Name</h3>
        <p id="profileRoleDisplay" class="badge bg-gold-outline">Student Member</p>
    </div>
    <div class="profile-details mt-4">
        <p class="m-0 text-muted">Archive ID</p>
        <p id="profileIdDisplay" class="fw-bold">--</p>
        <hr class="border-secondary">
        <button id="logoutBtnMain" class="btn btn-danger w-100">Leave the Archive</button>
        <button id="closeProfile" class="btn btn-link w-100 text-secondary mt-2">Close Records</button>
    </div>
</div>

<!-- 4. BLUR BACKDROP: Used for focus effects -->
<div id="blurBackdrop" class="blur-focus-backdrop"></div>
