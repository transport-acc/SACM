// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsDnjkNKHgdKAEHQ6ItSEaKR-o0CyZx_Y",
    authDomain: "transport-website-9fb6b.firebaseapp.com",
    projectId: "transport-website-9fb6b",
    storageBucket: "transport-website-9fb6b.firebasestorage.app",
    messagingSenderId: "601957546060",
    appId: "1:601957546060:web:d70ed8f9b258a0483fdce9",
    measurementId: "G-2JBG2SZRV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn'); // Login Button
const profileBtn = document.getElementById('profile-btn'); // Profile Button
const logoutBtn = document.getElementById('logout-btn'); // Logout Button (optional)
const userNameDisplay = document.getElementById('user-name'); // Element to show the user's name (optional)

// Function to update UI based on user state
function updateUI(user) {
    if (user) {
        // User is logged in
        loginBtn.classList.add('hidden'); // Hide login button
        profileBtn.classList.remove('hidden'); // Show profile button

        // Optional: Display user's name
        if (userNameDisplay && user.displayName) {
            userNameDisplay.textContent = `Welcome, ${user.displayName}!`;
        }
    } else {
        // User is not logged in
        loginBtn.classList.remove('hidden'); // Show login button
        profileBtn.classList.add('hidden'); // Hide profile button

        // Optional: Clear user's name
        if (userNameDisplay) {
            userNameDisplay.textContent = '';
        }
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    updateUI(user); // Update UI based on the user's state
});

// Logout functionality (optional)
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert('Logged out successfully!');
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    });
}
