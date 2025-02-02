import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
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

// Get tracking ID from URL
const urlParams = new URLSearchParams(window.location.search);
const trackingId = urlParams.get("trackingid");

// UI Elements
const trackingIdElem = document.getElementById("tracking-id");
const fromLocationElem = document.getElementById("from-location");
const toLocationElem = document.getElementById("to-location");
const distanceElem = document.getElementById("distance");
const priceElem = document.getElementById("price");
const bookingDateElem = document.getElementById("booking-date");
const deliveryDateElem = document.getElementById("delivery-date");
const statusElem = document.getElementById("status");

// Fetch shipment details from Firestore
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userUID = user.uid;
        if (trackingId) {
            try {
                const shipmentRef = doc(db, "shipments", userUID, "bookings", trackingId);
                const shipmentSnap = await getDoc(shipmentRef);

                if (shipmentSnap.exists()) {
                    const data = shipmentSnap.data();
                    trackingIdElem.textContent = trackingId;
                    fromLocationElem.textContent = `${data.from.city}, ${data.from.state}`;
                    toLocationElem.textContent = `${data.to.city}, ${data.to.state}`;
                    distanceElem.textContent = `${data.distance} km`;
                    priceElem.textContent = `₹${data.price}`;
                    bookingDateElem.textContent = new Date(data.bookingDate).toLocaleDateString();
                    deliveryDateElem.textContent = new Date(data.estimatedDeliveryDate).toLocaleDateString();
                    statusElem.textContent = data.status;
                } else {
                    trackingIdElem.textContent = "Not Found";
                    fromLocationElem.textContent = "-";
                    toLocationElem.textContent = "-";
                    distanceElem.textContent = "-";
                    priceElem.textContent = "-";
                    bookingDateElem.textContent = "-";
                    deliveryDateElem.textContent = "-";
                    statusElem.textContent = "-";
                    alert("Tracking ID not found.");
                }
            } catch (error) {
                console.error("Error fetching tracking details:", error);
                alert("Error fetching tracking details.");
            }
        } else {
            alert("No tracking ID provided.");
        }
    } else {
        alert("Please log in to track your shipment.");
    }
});
