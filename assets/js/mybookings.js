import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const bookingsList = document.getElementById("bookingsList");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userUID = user.uid;
        const userBookingsRef = collection(db, "shipments", userUID, "bookings");
        
        try {
            const querySnapshot = await getDocs(userBookingsRef);
            bookingsList.innerHTML = "";

            if (querySnapshot.empty) {
                bookingsList.innerHTML = "<p>No bookings found.</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const bookingItem = document.createElement("div");
                bookingItem.classList.add("booking-item");

                bookingItem.innerHTML = `
                    <h3>Tracking ID: ${data.trackingId}</h3>
                    <p><strong>From:</strong> ${data.from.city}, ${data.from.state}</p>
                    <p><strong>To:</strong> ${data.to.city}, ${data.to.state}</p>
                    <p><strong>Price:</strong> ₹${data.price}</p>
                    <p class="status ${data.status.toLowerCase()}"><strong>Status:</strong> ${data.status}</p>
                `;

                bookingsList.appendChild(bookingItem);
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            bookingsList.innerHTML = "<p>Error loading bookings. Please try again.</p>";
        }
    } else {
        bookingsList.innerHTML = "<p>Please log in to view your bookings.</p>";
    }
});
