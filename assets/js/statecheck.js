// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
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
const db = getFirestore(app);
// DOM Elements
const loginBtn = document.getElementById('login-btn');
const profileBtn = document.getElementById('profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const sidebarUsername = document.getElementById('sidebar-username');
const image = document.getElementById('profile-img');
// Monitor Auth State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginBtn.classList.add('hidden'); // Hide login button
        profileBtn.classList.remove('hidden'); // Show profile button
        
        let displayPhoto = user.photoURL;
        let displayName = user.displayName;
        if (!displayPhoto) {
            // Fetch name from Firestore if displayName is not available
            const userDocRef = doc(db, "users", user.uid);
            profileBtn.removeChild(image)
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    displayName = userDoc.data().name || "User";
                } else {
                    displayName = "User";
                }
                profileBtn.innerHTML = `<span>${displayName[0].toUpperCase()}</span>`
            } catch (error) {
                console.error("Error fetching user name:", error);
                displayName = "User";
            }
            console.log(profileBtn.textContent)
        }
        else{
            profileBtn.style.backgroundColor = 'transparent'
            image.src = displayPhoto;
        }
        sidebarUsername.textContent = `Welcome, ${displayName}`;
    } else {
        loginBtn.style.display = 'block'; // Show login button
        profileBtn.style.display = 'none'; // Hide profile button
        sidebarUsername.textContent = ''; // Clear username
    }
});

// Logout Logic
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth); // Sign out from Firebase
        alert('Logged out successfully!');
        sidebar.classList.remove('active'); // Close sidebar on logout
    } catch (error) {
        console.error('Error during logout:', error.message);
    }
});

// Redirect Login Button
loginBtn.addEventListener('click', () => {
    window.location.href = '../../pages/login.html'; // Redirect to login page
});
