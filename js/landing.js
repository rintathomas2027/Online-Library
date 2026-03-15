/**
 * 🎨 THE GRAND ARCHIVE - LANDING PAGE ENGINE (landing.js)
 * ==========================================================
 * This script runs exclusively on the entry splash page (index.php).
 * It creates the "First Impression" experience by:
 * 1. Managing the dramatic statue animations.
 * 2. Handling the "Begin Exploration" cinematic transition.
 * 3. Checking the scholar's login status to toggle the top-bar links.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 🏛 SELECT CORE ELEMENTS
    // These are the pieces of the page we want to manipulate.
    const beginBtn = document.getElementById('begin-exploration');
    const decoTop = document.querySelector('.start-top');      // Left Statue
    const decoBottom = document.querySelector('.start-bottom');   // Right Statue
    const heroContent = document.querySelector('.hero-content');  // Main Title Box

    // 👤 AUTHENTICATION CHECK
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    /**
     * Function: updateLandingAuth
     * Purpose: Dynamically changes the Navigation Bar links based on user status. 
     */
    function updateLandingAuth() {
        const authLink = document.getElementById('auth-link-landing');
        const logoutBtn = document.getElementById('logout-btn-landing');
        
        if (isLoggedIn) {
            // If the user already exists in local memory, we show the 'Logout' option.
            if (authLink) authLink.style.display = 'none';
            if (logoutBtn) {
                logoutBtn.style.display = 'inline-block';
                logoutBtn.onclick = () => {
                    localStorage.clear();    // Terminate local session
                    window.location.reload(); // Refresh to reflect guest status
                };
            }
        } else {
            // If they are a new visitor, they only see the 'Scholar Login' option.
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (authLink) {
                authLink.style.display = 'inline-block';
                authLink.innerText = 'Scholar Login';
                authLink.href = 'login.php';
            }
        }
    }
    
    // Run the UI check immediately
    updateLandingAuth();

    // ─── 🎞 THE CINEMATIC CURTAIN ───────────────────────────────────────────
    /**
     * We create an invisible black overlay in memory. 
     * When the user clicks "Begin", we fade this overlay in to 
     * mask the browser's loading "flash" between pages.
     */
    const curtain = document.createElement('div');
    curtain.id = 'page-curtain';
    Object.assign(curtain.style, {
        position: 'fixed',
        inset: '0',
        background: '#12100e',      // Matches the Archive's dark theme
        zIndex: '99999',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.6s cubic-bezier(0.7, 0, 0.3, 1)',
    });
    document.body.appendChild(curtain);

    // ─── 🚀 TRANSITION HANDLER ──────────────────────────────────────────────
    if (beginBtn) {
        beginBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetUrl = beginBtn.getAttribute('href');

            /**
             * STEP 1: Fly away!
             * We add the 'is-exiting' class which triggers the CSS animations 
             * to slide the statues horizontally off-screen.
             */
            if (decoTop) decoTop.classList.add('is-exiting');
            if (decoBottom) decoBottom.classList.add('is-exiting');
            if (heroContent) heroContent.classList.add('is-exiting');

            /**
             * STEP 2: The Black Out
             * We fade in the curtain to create a sense of mystery before 
             * hitting the next page.
             */
            setTimeout(() => {
                curtain.style.pointerEvents = 'all'; 
                curtain.style.opacity = '1';
            }, 600);

            /**
             * STEP 3: The Leap
             * After precisely 1.1 seconds, we jump to the next volume (page).
             */
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1100);
        });
    }
});
