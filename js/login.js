$(document).ready(function () {
"use strict";

/* ------------ DOM ELEMENTS ------------ */

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

const API_PATH = "backend-api.php";

/* ------------ MESSAGE UTILITIES ------------ */

function showMessage($container, message, isError = true) {
    $container
        .text(message)
        .addClass("is-visible")
        .toggleClass("error", isError)
        .toggleClass("success", !isError);
}

function clearMessage($container) {
    $container.removeClass("is-visible error success").text("");
}

/* ------------ SIGNUP MODAL ------------ */

if ($openSignupBtn.length) {

    $openSignupBtn.on("click", function (e) {
        e.preventDefault();
        $signupOverlay.addClass("is-visible").attr("aria-hidden", "false");
    });

}

function hideSignup() {

    $signupOverlay.removeClass("is-visible").attr("aria-hidden", "true");

    if ($signupForm.length) {
        $signupForm[0].reset();
    }

}

$closeSignupBtn.on("click", hideSignup);

/* ------------ REGISTRATION ------------ */

if ($signupForm.length) {

$signupForm.on("submit", function (e) {

    e.preventDefault();

    const data = {
        id_no: $("#signup-id-no").val().trim(),
        full_name: $("#signup-name").val().trim(),
        email: $("#signup-email").val().trim(),
        password: $("#signup-password").val()
    };

    if (!data.id_no || !data.full_name || !data.email || !data.password) {
        alert("All fields are required.");
        return;
    }

    $registerBtn.prop("disabled", true).text("Registering...");

    $.ajax({
        url: API_PATH + "?action=register",
        type: "POST",
        data: data,
        dataType: "json",

        success: function (response) {

            if (response.success) {

                $registerBtn.text("Registered!");

                setTimeout(function () {
                    hideSignup();
                    $registerBtn.prop("disabled", false).text("Register");
                }, 1200);

            } else {

                alert(response.error || "Registration failed.");

                $registerBtn.prop("disabled", false).text("Register");
            }
        },

        error: function () {

            alert("Server connection failed.");

            $registerBtn.prop("disabled", false).text("Register");
        }
    });

});

}

/* ------------ LOGIN ------------ */

if ($loginForm.length) {

$loginForm.on("submit", function (e) {

    e.preventDefault();

    clearMessage($loginMessage);

    const idNo = $("#login-id-no").val().trim();
    const password = $("#password").val();

    if (!idNo || !password) {

        showMessage(
            $loginMessage,
            "Please enter ID number and password."
        );

        return;
    }

    $loginBtnLabel.hide();
    $loginBtnSpinner.prop("hidden", false);
    $loginBtn.prop("disabled", true);

    $.ajax({

        url: API_PATH + "?action=login",
        type: "POST",
        data: {
            id_no: idNo,
            password: password
        },
        dataType: "json",

        success: function (response) {

            if (response.success) {

                showMessage(
                    $loginMessage,
                    "Login successful. Redirecting...",
                    false
                );

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userIdNo", response.user.id_no);
                localStorage.setItem("userName", response.user.full_name);
                localStorage.setItem("userRole", response.user.role || "user");

                setTimeout(function () {

                    if (response.user.role === "admin") {
                        window.location.href = "admin.php";
                    } else {
                        window.location.href = "library.php";
                    }

                }, 1000);

            } else {

                showMessage(
                    $loginMessage,
                    response.error || "Invalid login credentials."
                );

                resetLoginButton();
            }
        },

        error: function () {

            showMessage(
                $loginMessage,
                "Unable to connect to server."
            );

            resetLoginButton();
        }

    });

});

}

function resetLoginButton() {
    $loginBtnLabel.show();
    $loginBtnSpinner.prop("hidden", true);
    $loginBtn.prop("disabled", false);
}

/* ------------ CARD VISUAL EFFECT ------------ */

const $loginCard = $(".login-card");

if ($loginCard.length) {

    $(document).on("mousemove", function (e) {

        const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 30;

        $loginCard.css(
            "transform",
            `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`
        );

    });

}

/* ------------ PASSWORD TOGGLE ------------ */

$(".toggle-password").on("click", function () {

    const $input = $(this).prev("input");

    if ($input.length === 0) return;

    const type = $input.attr("type") === "password" ? "text" : "password";

    $input.attr("type", type);

    $(this).text(type === "password" ? "🔒" : "👁");

});

});