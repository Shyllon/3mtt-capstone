import config from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const loginSuccess = document.getElementById("login-success");
    const registerForm = document.getElementById("register-form");
    const registerError = document.getElementById("register-error");
    const registerSuccess = document.getElementById("register-success");

    // Handle Login Form Submission
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Clear previous messages
        loginError.textContent = "";
        loginSuccess.textContent = "";

        try {
            const response = await fetch(`${config.apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid login credentials.");
            }

            const data = await response.json();
            const token = data.token;

            // Store token in localStorage
            localStorage.setItem("authToken", token);

            // Show success message
            loginSuccess.textContent = "Login successful! Redirecting...";

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = "/dashboard"; // Adjust based on your routing
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = error.message;
        }
    });

    // Handle Registration Form Submission
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Clear previous messages
        registerError.textContent = "";
        registerSuccess.textContent = "";

        // Validate passwords match
        if (password !== confirmPassword) {
            registerError.textContent = "Passwords do not match.";
            return;
        }

        try {
            const response = await fetch(`${config.apiUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error("Registration failed.");
            }

            const data = await response.json();

            // Show success message
            registerSuccess.textContent = "Registration successful! Please login.";

            // Optionally, toggle to the login form
            setTimeout(() => {
                document.getElementById("register-toggle").click(); // Switch to login form
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            registerError.textContent = error.message;
        }
    });
});
