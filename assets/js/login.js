// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore

// Toggle Forms
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toastNotification = document.querySelector('.toast-notification');
loginToggle.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
});

signupToggle.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
});

// Sign Up Functionality
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem('loggedIn',true)
        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            userId: user.uid,
            createdAt: new Date().toISOString(),
        });
        toastNotification.style.right = '20px'
        setTimeout(() => {
            window.location.href = '/'
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
});

// Login Functionality
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('loggedIn',true)
        toastNotification.style.right = '20px'
        setTimeout(() => {
            window.location.href = '/'
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
});

// Google Login
const googleLoginBtn = document.getElementById('google-login-btn');
const googlesignUpBtn = document.getElementById('google-signup-btn');
googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if the user already exists in Firestore
        localStorage.setItem('loggedIn',true)
        toastNotification.style.right = '20px'
        setTimeout(() => {
            window.location.href = '/'
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
});
googlesignUpBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if the user already exists in Firestore
        localStorage.setItem('loggedIn',true)
        toastNotification.style.right = '20px'
        setTimeout(() => {
            window.location.href = '/'
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
});
