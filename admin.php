<!DOCTYPE html>
<html lang="en">
<!-- 
  🏰 THE GRAND ARCHIVE - THE CONTROL ROOM (admin.php)
  ==========================================================
  This is the administrative center for the library. Only 
  scholars with 'admin' clearance can access this page. 
  It allows managing the global collection and member records.
-->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Hall | Grand Archive</title>
    
    <!-- UI Frameworks -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Main Decorative Stylesheet -->
    <link rel="stylesheet" href="css/auth-admin-theme.css">
    
    <style>
        /* [DASHBOARD SPECIFIC STYLES] */
        :root {
            --primary-gold: #c5a059;
            --dark-bg: #12100e;
            --card-bg: rgba(18, 16, 14, 0.9);
        }

        body {
            background-color: var(--dark-bg);
            color: #d4c2a8;
            font-family: 'Cormorant Garamond', serif;
        }

        .admin-navbar {
            background: #1a1714;
            border-bottom: 1px solid var(--primary-gold);
            padding: 1rem 0;
            margin-bottom: 2rem;
        }

        .dashboard-card {
            background: var(--card-bg);
            border: 1px solid var(--primary-gold);
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(197, 160, 89, 0.1);
        }

        .tab-btn {
            background: transparent;
            border: 1px solid var(--primary-gold);
            color: var(--primary-gold);
            padding: 0.5rem 1.5rem;
            font-family: 'Cinzel', serif;
            transition: all 0.3s ease;
        }

        .tab-btn.active {
            background: var(--primary-gold);
            color: var(--dark-bg);
        }
    </style>
</head>

<body>
    <!-- 1. ADMIN HEADER -->
    <nav class="admin-navbar">
        <div class="container d-flex justify-content-between align-items-center">
            <a href="index.php" class="nav-brand-text cinzel">ARCHIVE CONTROL</a>
            <div class="d-flex align-items-center gap-3">
                <span>Greetings, <strong id="admin-name">Master Archivist</strong></span>
                <button onclick="logout()" class="btn btn-outline-danger btn-sm">Seal Vault</button>
            </div>
        </div>
    </nav>

    <main class="container">
        <!-- 2. DASHBOARD TABS -->
        <div class="d-flex mb-4">
            <button class="tab-btn active me-2" onclick="showTab('users-section')">Active Scholars</button>
            <button class="tab-btn" onclick="showTab('books-section')">Archive Catalog</button>
        </div>

        <!-- 3. SCHOLAR MANAGEMENT SECTION -->
        <section id="users-section" class="admin-section active">
            <div class="dashboard-card">
                <div class="p-4">
                    <h3 class="mb-4">Registered Members</h3>
                    <div class="table-responsive">
                        <table class="table table-dark table-premium" id="users-table">
                            <thead>
                                <tr>
                                    <th>ID NO</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>CLEARANCE</th>
                                    <th class="text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody><!-- Populated by admin.js --></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. CATALOG MANAGEMENT SECTION -->
        <section id="books-section" class="admin-section" style="display:none;">
            <div class="dashboard-card">
                <div class="p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Archive Catalog</h3>
                        <button class="btn btn-primary" onclick="toggleBookForm()">+ Add New Volume</button>
                    </div>

                    <!-- Add New Book Form (Hidden by default) -->
                    <div id="add-book-form" class="mb-4 p-4 border border-secondary rounded" style="display:none;">
                        <form id="add-book-form-element">
                            <div class="row g-3">
                                <div class="col-md-6"><input type="text" id="book-title" class="form-control" placeholder="Book Title" required></div>
                                <div class="col-md-6"><input type="text" id="book-author" class="form-control" placeholder="Author Name" required></div>
                                <div class="col-md-4"><input type="text" id="book-genre" class="form-control" placeholder="Genre"></div>
                                <div class="col-md-4"><input type="number" id="book-stock" class="form-control" placeholder="Initial Stock" required></div>
                                <div class="col-md-4"><input type="text" id="book-image" class="form-control" placeholder="Image URL (img/...)"></div>
                                <div class="col-12"><textarea id="book-summary" class="form-control" placeholder="Volume Summary..."></textarea></div>
                                <div class="col-12 text-end"><button type="submit" class="btn btn-success">Acquire Volume</button></div>
                            </div>
                        </form>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-dark table-premium" id="books-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TITLE</th>
                                    <th>AUTHOR</th>
                                    <th>STOCK</th>
                                    <th class="text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody><!-- Populated by admin.js --></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- 5. SCRIPTS -->
    <script src="js/admin.js"></script>
    <script>
        // Security logic: check if user is actually an admin
        if (localStorage.getItem('userRole') !== 'admin') {
            window.location.href = 'login.php';
        }
        document.getElementById('admin-name').textContent = localStorage.getItem('userName') || 'Archivist';

        function logout() {
            localStorage.clear();
            window.location.href = 'login.php';
        }
    </script>
</body>
</html>