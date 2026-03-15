<!DOCTYPE html>
<html lang="en">
<!-- 
  ✨ THE GRAND ARCHIVE - ENTRANCE HALL (index.php)
  ==========================================================
  This is the first page any visitor sees. It serves as an 
  immersive landing experience. 
-->

<head>
    <title>The Grand Archive | AJCE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Bootstrap 5 for Layout structure -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Our main design system. Handles the dark theme and decorative statues. -->
    <link rel="stylesheet" href="css/library-main.css">
</head>

<body class="landing">
    <!-- 1. DECORATIVE STATUES: They slide in from the top and bottom on load. -->
    <div class="landing-deco start-top">
        <img src="img/statue-top.png" alt="Ancient Statue Top">
    </div>
    <div class="landing-deco start-bottom">
        <img src="img/statue-bottom.png" alt="Ancient Statue Bottom">
    </div>

    <!-- 2. NAVIGATION BAR: Sticky header with Dynamic Login/Logout buttons. -->
    <nav class="navbar px-lg-5 px-3">
        <h2 class="m-0">AJCE Archive</h2>
        <div class="d-flex align-items-center gap-3">
            <!-- These links are toggled by js/landing.js based on login state. -->
            <a id="auth-link-landing" href="login.php" class="nav-btn">Scholar Login</a>
            <button id="logout-btn-landing" class="btn btn-danger" style="display:none;">Leave Archive</button>
        </div>
    </nav>

    <!-- 3. HERO SECTION: The heart of the landing page. -->
    <main class="hero">
        <div class="hero-content">
            <h1>The Grand Archive</h1>
            <p>A Place Where Stories Awaken & Knowledge Resides</p>
            
            <!-- This button triggers the cinematic transition to the library. -->
            <a href="library.php" id="begin-exploration" class="cta-btn">Begin Exploration</a>
        </div>
    </main>

    <!-- 4. FOOTER: Preservation notice. -->
    <footer class="mt-auto py-3">
        <p class="m-0">&copy; 2026 Amal Jyothi College. All digital records are preserved.</p>
    </footer>

    <!-- Background atmosphere scripts -->
    <script src="js/landing.js"></script>
</body>
</html>