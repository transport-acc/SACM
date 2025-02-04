// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";


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

// Get Tracking ID from URL
const urlParams = new URLSearchParams(window.location.search);
const trackingId = urlParams.get('trackingid');

let userUID = null;
let loader = document.querySelector('.loader-container');
loader.style.display = 'none'
// Firebase Authentication (to get the current user UID)
onAuthStateChanged(auth, user => {
    if (user) {
        userUID = user.uid;
        fetchBookingDetails();
    } else {
        alert("Please log in to view your booking details.");
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
});

// Function to fetch booking details from Firestore
async function fetchBookingDetails() {
    loader.style.display = 'grid'
    if (!trackingId) {
        alert("Tracking ID is missing!");
        return;
    }

    try {
        const userShipmentsRef = doc(db, "shipments", userUID, "bookings", trackingId);
        const docSnap = await getDoc(userShipmentsRef);

        if (docSnap.exists()) {
            const shipmentData = docSnap.data();
            displayBookingDetails(shipmentData);
            sendConfirmationEmail(shipmentData); // Send email after fetching details
            loader.style.display = 'none';
        } else {
            alert("No booking found for the provided tracking ID.");
        }
    } catch (error) {
        console.error("Error fetching booking details:", error);
        alert("There was an error fetching your booking details.");
    }
}

// Function to display the booking details on the page
function displayBookingDetails(shipmentData) {
    document.getElementById("tracking-id").textContent = shipmentData.trackingId;
    document.getElementById("from-city").textContent = shipmentData.from.city;
    document.getElementById("from-state").textContent = shipmentData.from.state;
    document.getElementById("to-city").textContent = shipmentData.to.city;
    document.getElementById("to-state").textContent = shipmentData.to.state;
    document.getElementById("estimated-delivery").textContent = new Date(shipmentData.estimatedDeliveryDate).toLocaleDateString();
    document.getElementById("total-price").textContent = shipmentData.price;
    document.getElementById("status").textContent = shipmentData.status;
    document.getElementById("product-type").textContent = shipmentData.productType || '';
    document.getElementById("product-name").textContent = shipmentData.productName || '';
}

// Function to send a confirmation email using EmailJS
async function sendConfirmationEmail(shipmentData) {
    const user = auth.currentUser;

    if (!user || !user.email) {
        console.error("User email not available");
        return;
    }

    try {
        const emailParams = {
            to_email: user.email,
            tracking_id: shipmentData.trackingId,
            from_city: shipmentData.from.city,
            from_state: shipmentData.from.state,
            to_city: shipmentData.to.city,
            to_state: shipmentData.to.state,
            total_price: shipmentData.price || 'Not Provided',
            estimated_receiving_date: new Date(shipmentData.estimatedDeliveryDate).toLocaleDateString(),
        };

        const result = await emailjs.send(
            "service_6tzyinn",    // EmailJS service ID
            "template_eeiprf9",    // EmailJS template ID
            emailParams,           // Parameters to replace in the template
            "fhKVrW2Ae-NFbTiOb"   // EmailJS user ID
        );

        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
