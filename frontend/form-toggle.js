
document.addEventListener("DOMContentLoaded", () => {
    const loginToggle = document.getElementById("login-toggle");
    const registerToggle = document.getElementById("register-toggle");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // Toggle to Registration Form
    registerToggle.addEventListener("click", () => {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        loginToggle.classList.remove("active");
        registerToggle.classList.add("active");
    });

    // Toggle to Login Form
    loginToggle.addEventListener("click", () => {
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        registerToggle.classList.remove("active");
        loginToggle.classList.add("active");
    });
});
