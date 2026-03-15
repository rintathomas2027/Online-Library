<!DOCTYPE html>
<html lang="en">
<!-- 
  🔑 THE GRAND ARCHIVE - THE VAULT GATE (login.php)
  ==========================================================
  This page handles user identification. It includes both the 
  login interface and a hidden registration overlay.
-->

<head>
    <title>AJCE Archive | Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Glassmorphism & Auth Specific Styles -->
    <link rel="stylesheet" href="css/auth-admin-theme.css" />
    
    <!-- Required External Libraries -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body class="login-body">
    <!-- Interactive Atmosphere Backgrounds -->
    <div id="galaxy-bg"></div>
    <div id="atmosphere-particles"></div>

    <main class="main">
        <section class="intro">
            <h1 class="intro-title">Amal Jyothi College of Engineering</h1>
            <h1 class="intro-subtitle">A Place Where Stories Awaken & Knowledge Resides</h1>
        </section>

        <!-- THE LOGIN CARD -->
        <section class="login-section">
            <div class="login-card">
                <h2 class="auth-title">Identify Scholar</h2>
                
                <form id="login-form">
                    <div class="form-group mb-4">
                        <label for="login-id-no">Archive ID No.</label>
                        <input type="text" id="login-id-no" placeholder="e.g. 911" required autocomplete="username" />
                    </div>

                    <div class="form-group mb-4">
                        <label for="password">Security Code</label>
                        <div class="password-wrapper">
                            <input type="password" id="password" placeholder="••••••••" required autocomplete="current-password" />
                            <button type="button" class="toggle-password" aria-label="Toggle password visibility">🔒</button>
                        </div>
                    </div>

                    <div id="login-message" class="auth-message"></div>

                    <button type="submit" id="login-button" class="btn-premium">
                        <span class="btn-label">Access the Vault</span>
                        <div class="btn-spinner" hidden></div>
                    </button>
                </form>

                <div class="auth-footer mt-4 text-center">
                    <p>New to the Archive? <a href="#" id="open-signup" class="gold-link">Register Record</a></p>
                </div>
            </div>
        </section>
    </main>

    <!-- REGISTRATION OVERLAY (Hidden by default) -->
    <div id="signup-overlay" class="auth-overlay" aria-hidden="true">
        <div class="overlay-content">
            <button id="close-signup" class="close-btn">&times;</button>
            <h2 class="auth-title mb-4">New Scholar Registration</h2>
            
            <form id="signup-form">
                <input type="text" id="signup-id-no" placeholder="Archive ID No." required />
                <input type="text" id="signup-name" placeholder="Full Scholar Name" required />
                <input type="email" id="signup-email" placeholder="Institutional Email" required />
                <input type="password" id="signup-password" placeholder="Security Code" required />
                
                <button type="submit" id="register-button" class="btn-premium w-100 mt-3">Register Volume</button>
            </form>
        </div>
    </div>

    <!-- Core Scripts -->
    <script src="js/galaxy.js"></script>
    <script src="js/login.js"></script>
</body>
</html>