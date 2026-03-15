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

    const showMessage = ($container, text, isError = true) => {
        $container.text(text)
                  .addClass("is-visible")
                  .toggleClass("error", isError)
                  .toggleClass("success", !isError);
    };

    const clearMessage = ($container) => {
        $container.text("").removeClass("is-visible error success");
    };

    // --- Signup Modal Transitions ---
    $openSignupBtn.on("click", function(e) {
        e.preventDefault();
        $signupOverlay.addClass("is-visible").attr("aria-hidden", "false");
    });

    const hideSignup = () => {
        $signupOverlay.addClass("is-leaving").removeClass("is-visible");
        setTimeout(function() {
            $signupOverlay.removeClass("is-leaving").attr("aria-hidden", "true");
            $signupForm[0].reset();
        }, 500);
    };

    $closeSignupBtn.on("click", hideSignup);

    // --- Registration Logic ---
    $signupForm.on("submit", function(e) {
        e.preventDefault();

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

        $.post(`${API_PATH}?action=register`, data)
            .done(function(result) {
                if (result.success) {
                    $registerBtn.text("Scholar Registered!").css("background", "var(--success)");
                    setTimeout(function() {
                        hideSignup();
                        $registerBtn.prop("disabled", false).text("Register Volume").css("background", "");
                    }, 1200);
                } else {
                    alert(result.error || "The Archive rejected this registration.");
                    $registerBtn.prop("disabled", false).text("Register");
                }
            })
            .fail(function() {
                console.error("Connection Failed");
                $registerBtn.prop("disabled", false).text("Retry Registration");
            });
    });

    // --- Login Logic ---
    $loginForm.on("submit", function(e) {
        e.preventDefault();
        clearMessage($loginMessage);

        const idNo = $("#login-id-no").val().trim();
        const password = $("#password").val().trim();

        if (!idNo) {
            showMessage($loginMessage, "Identification Required: Please enter your ID No.");
            return;
        }

        $loginBtnLabel.hide();
        $loginBtnSpinner.prop("hidden", false);
        $loginBtn.prop("disabled", true);

        $.post(`${API_PATH}?action=login`, { id_no: idNo, password: password })
            .done(function(result) {
                if (result.success) {
                    showMessage($loginMessage, "Identity Verified. Accessing the Vault...", false);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userIdNo", result.user.id_no);
                    localStorage.setItem("userName", result.user.full_name);
                    localStorage.setItem("userRole", result.user.role || 'user');

                    setTimeout(() => {
                        window.location.href = result.user.role === 'admin' ? "admin.php" : "library.php";
                    }, 1000);
                } else {
                    showMessage($loginMessage, result.error || "Forbidden: Identification provided is invalid.");
                    $loginBtnLabel.show();
                    $loginBtnSpinner.prop("hidden", true);
                    $loginBtn.prop("disabled", false);
                }
            })
            .fail(function() {
                showMessage($loginMessage, "The Archive is currently unreachable. Check connection.");
                $loginBtnLabel.show();
                $loginBtnSpinner.prop("hidden", true);
                $loginBtn.prop("disabled", false);
            });
    });

    // --- Visual Effects ---
    const $loginCard = $(".login-card");
    if ($loginCard.length) {
        $(document).on("mousemove", function(e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
            $loginCard.css("transform", `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`);
        });
    }

    $(".toggle-password").on("click", function() {
        const $input = $(this).siblings("input");
        const type = $input.attr("type") === "password" ? "text" : "password";
        $input.attr("type", type);
        $(this).text(type === "password" ? "🔒" : "👁");
    });
});
