<!DOCTYPE html>
<html lang="en">
<!-- 
  📚 THE GRAND ARCHIVE - THE BOOK VAULT (library.php)
  ==========================================================
  This is the primary exploration interface. It displays the 
  collection of books, allows searching, and handling 
  reservations via a slide-out cart.
-->

<head>
    <title>The Book Archive | AJCE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap 5 for Grid and UI components like Modals/Offcanvas -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/library-main.css">
</head>

<body class="library-body">
    <!-- CINEMATIC SHUTTER: Slides up when the page is ready -->
    <div class="shutter-reveal"></div>

    <!-- MAIN HEADER: Toggled by library logic based on Scholar status -->
    <header class="library-header">
        <nav class="navbar archival-nav-top py-2 px-3 reveal-item">
            <div class="container-fluid p-0">
                <a class="navbar-brand back-link-archival" href="index.php">
                    <span class="back-sym">&#x21A4;</span> Return to Menu
                </a>
                <div class="ms-auto d-flex align-items-center gap-3">
                    <div id="authArea"></div> <!-- Filled by js/library-logic.js -->
                    
                    <!-- CART ICON: Opens the reservation panel -->
                    <button id="cartBtn" class="premium-cart-btn-archival" style="display:none;">
                        <span class="cart-icon-main">🛒</span>
                        <span id="cartCount" class="cart-badge-archival">0</span>
                    </button>
                </div>
            </div>
        </nav>

        <!-- SEARCH & FILTER BAR -->
        <div class="header-tier-bottom py-3 px-3 reveal-item">
            <div class="container-fluid">
                <div class="row align-items-center g-3">
                    <div class="col-lg-3 col-md-4 col-12">
                        <select id="genreSelect" class="form-select archival-select-sm"></select>
                    </div>
                    <div class="col-lg-6 col-md-8 col-12">
                        <div class="search-input-group-archival">
                            <input type="text" id="searchInput" class="form-control archival-input-sm" placeholder="Search the Great Vault...">
                            <ul id="suggestions" class="suggestions-list-archival" hidden></ul>
                        </div>
                    </div>
                    <div class="col-lg-3 col-12 text-lg-end text-center">
                        <span id="totalBooks" class="stats-text archival-main-title">Total Records: --</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- BOOK COLLECTION GRID -->
    <main class="container-fluid py-5">
        <div id="bookContainer" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <!-- Dynamically populated by displayBooks() -->
        </div>
        
        <!-- PAGINATION: Navigation through the archive pages -->
        <div id="pagination" class="mt-5 reveal-item"></div>
    </main>

    <!-- UI MODALS: Reservation & Information popups -->
    <?php include "components/modals.php"; // (Note: I'll create this component to keep library.php clean) ?>

    <!-- SIDE PANEL: The Reservation Cart -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="cartPanel">
        <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title">Your Collection</h5>
            <button type="button" class="btn-close btn-close-white" id="closeCart"></button>
        </div>
        <div class="offcanvas-body">
            <div id="cartList"></div>
        </div>
    </div>

    <!-- SYSTEM TOASTS: For real-time notifications -->
    <div id="toastContainer" class="toast-container position-fixed bottom-0 end-0 p-3"></div>

    <!-- CORE SCRIPTS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/library-logic.js"></script>
    <script src="js/library-interactions.js"></script>
</body>
</html>