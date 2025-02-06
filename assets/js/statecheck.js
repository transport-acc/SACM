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
const logOutModal = document.querySelector('.logout-container');
const logOutConfirm = document.querySelector('.primary');
const logOutCancel = document.querySelector('.secondary');
const logOutExit = document.querySelector('.exit-button')
logOutModal.style.top = '-80%'
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
const menuBtn = document.querySelector('.hamburger-menu');
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
        else {
            profileBtn.style.backgroundColor = 'transparent'
            image.src = displayPhoto;
        }
        sidebarUsername.textContent = `Welcome, ${displayName}`;
    } else {
        menuBtn.style.right = '110px'
        loginBtn.style.display = 'block'; // Show login button
        profileBtn.style.display = 'none'; // Hide profile button
        sidebarUsername.textContent = ''; // Clear username
    }
});

// Logout Logic

logoutBtn.addEventListener('click', async () => {
    logOutModal.style.top = '50%';
    sidebar.classList.remove('active');
});

logOutConfirm.addEventListener('click', () => {
    signOut(auth).then(() => {
        sidebar.classList.remove('active');
        logOutModal.style.top = '-80%';
    }).catch((error) => {
        alert(`Error in logging out ${error.message}`)
    });
});
logOutCancel.addEventListener('click', () => {
    logOutModal.style.top = '-80%'
});
logOutExit.addEventListener('click', () => {
    logOutModal.style.top = '-80%'
});




// Redirect Login Button
loginBtn.addEventListener('click', () => {
    window.location.href = '../../pages/login.html'; // Redirect to login page
});
