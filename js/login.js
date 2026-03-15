/**
 * 🔑 THE GRAND ARCHIVE - AUTHENTICATION ENGINE (login.js)
 * ==========================================================
 * This script handles the "Front Door" of our archive. 
 * It manages:
 * 1. User Login validation and server-side verification.
 * 2. New Scholar Registration (Signup) with modal animations.
 * 3. 3D Tilt effects and password visibility toggles.
 *
 * This version uses jQuery for smooth DOM manipulation and 
 * high-level event handling.
 */

$(function() {
    "use strict";

    // --- 1. DOM ELEMENTS (jQuery Selection) ---
    const $loginForm = $("#login-form");
    const $loginMessage = $("#login-message");
    const $loginBtn = $("#login-button");
    const $loginBtnLabel = $loginBtn.find(".btn-label");
    const $loginBtnSpinner = $loginBtn.find(".btn-spinner");
    const $openSignupBtn = $("#open-signup");
    const $signupOverlay = $("#signup-overlay");
    const $signupForm = $("#signup-form");
    const $closeSignupBtn = $("#close-signup");
    const $registerBtn = $("#register-button");

    const API_PATH = "backend-api.php"; // Renamed from api.php

    // --- 2. UI UTILITIES ---

    /**
     * Utility: showMessage
     * Purpose: Displays success/error alerts within the login card.
     */
    const showMessage = ($container, text, isError = true) => {
        $container.text(text)
                  .addClass("is-visible")
                  .toggleClass("error", isError)
                  .toggleClass("success", !isError);
    };

    const clearMessage = ($container) => {
        $container.text("").removeClass("is-visible error success");
    };

    /**
     * Role: Signup Modal Transitions
     */
    $openSignupBtn.on("click", (e) => {
        e.preventDefault();
        $signupOverlay.addClass("is-visible").attr("aria-hidden", "false");
    });

    const hideSignup = () => {
        $signupOverlay.addClass("is-leaving").removeClass("is-visible");
        setTimeout(() => {
            $signupOverlay.removeClass("is-leaving").attr("aria-hidden", "true");
            $signupForm[0].reset();
        }, 500);
    };

    $closeSignupBtn.on("click", hideSignup);

    // --- 3. REGISTRATION LOGIC ---
    $signupForm.on("submit", async function(e) {
        e.preventDefault();

        // 📝 Gather scholar details
        const data = {
            id_no: $("#signup-id-no").val().trim(),
            full_name: $("#signup-name").val().trim(),
            email: $("#signup-email").val().trim(),
            password: $("#signup-password").val().trim()
        };

        if (!data.id_no || !data.full_name || !data.email || !data.password) {
            alert("All archival fields are required for registration.");
            return;
        }

        $registerBtn.prop("disabled", true).text("Verifying...");

        try {
            const response = await fetch(`${API_PATH}?action=register`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: $.param(data)
            });

            const result = await response.json();

            if (response.ok) {
                $registerBtn.text("Scholar Registered!").css("background", "var(--success)");
                setTimeout(() => {
                    hideSignup();
                    $registerBtn.prop("disabled", false).text("Register Volume").css("background", "");
                }, 1200);
            } else {
                alert(result.error || "The Archive rejected this registration.");
                $registerBtn.prop("disabled", false).text("Register");
            }
        } catch (err) {
            console.error("Connection Failed:", err);
            $registerBtn.prop("disabled", false).text("Retry Registration");
        }
    });

    // --- 4. LOGIN LOGIC ---
    $loginForm.on("submit", async function(e) {
        e.preventDefault();
        clearMessage($loginMessage);

        const idNo = $("#login-id-no").val().trim();
        const password = $("#password").val().trim();

        if (!idNo) {
            showMessage($loginMessage, "Identification Required: Please enter your ID No.");
            return;
        }

        // 🔄 Show the loading spinner
        $loginBtnLabel.hide();
        $loginBtnSpinner.prop("hidden", false);
        $loginBtn.prop("disabled", true);

        try {
            const response = await fetch(`${API_PATH}?action=login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: $.param({ id_no: idNo, password: password })
            });

            const result = await response.json();

            if (response.ok) {
                showMessage($loginMessage, "Identity Verified. Accessing the Vault...", false);
                
                // 💾 Store session tokens locally
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userIdNo", result.user.id_no);
                localStorage.setItem("userName", result.user.full_name);
                localStorage.setItem("userRole", result.user.role || 'user');

                // 🚀 Immediate redirect based on status
                setTimeout(() => {
                    window.location.href = result.user.role === 'admin' ? "admin.php" : "library.php";
                }, 1000);
            } else {
                showMessage($loginMessage, result.error || "Forbidden: Identification provided is invalid.");
                $loginBtnLabel.show();
                $loginBtnSpinner.prop("hidden", true);
                $loginBtn.prop("disabled", false);
            }
        } catch (err) {
            showMessage($loginMessage, "The Archive is currently unreachable. Check connection.");
            $loginBtnLabel.show();
            $loginBtnSpinner.prop("hidden", true);
            $loginBtn.prop("disabled", false);
        }
    });

    // --- 5. VISUAL EFFECTS ---

    /**
     * 3D Tilt: Makes the login card lean towards the mouse pointer.
     */
    const $loginCard = $(".login-card");
    if ($loginCard.length) {
        $(document).on("mousemove", (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
            $loginCard.css("transform", `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`);
        });
    }

    /**
     * Password Visibility Toggle
     */
    $(".toggle-password").on("click", function() {
        const $input = $(this).siblings("input");
        const type = $input.attr("type") === "password" ? "text" : "password";
        $input.attr("type", type);
        $(this).text(type === "password" ? "🔒" : "👁");
    });
});
