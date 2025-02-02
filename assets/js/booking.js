import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";


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

// UI Elements
const fromState = document.getElementById("from-state");
const fromCity = document.getElementById("from-city");
const toState = document.getElementById("to-state");
const toCity = document.getElementById("to-city");
const calculateBtn = document.getElementById("calculate");
const priceElement = document.getElementById("price");
const bookNowBtn = document.getElementById("book-now");
const paymentModal = document.querySelector(".payment-modal");
const payBtn = document.querySelector(".purchase--btn");
const closeModal = document.querySelector(".close-modal");

let userUID = null;
let estimatedKmElement = document.getElementById("estimated-km");
let totalPrice = 0;
let distance = 0;

// OpenCage API Key
const OPENCAGE_API_KEY = "0f53a657ecf14b4bb60007be6e669cb7";  // Get your OpenCage API key

// **Fetch City Suggestions from OpenCage API**
// async function fetchCitySuggestions(input, state) {
//     if (input.length < 2) return [];

//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${input},${state},India&key=${OPENCAGE_API_KEY}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data.results.map(result => result.formatted);
//     } catch (error) {
//         console.error("Error fetching city suggestions:", error);
//         return [];
//     }
// }

// // **Render Suggestions Below Input Field**
// function renderCitySuggestions(suggestions, inputFieldId) {
//     const suggestionContainer = document.getElementById(`${inputFieldId}-suggestions`);
//     suggestionContainer.innerHTML = '';

//     if (suggestions.length > 0) {
//         suggestions.forEach(suggestion => {
//             const suggestionItem = document.createElement('div');
//             suggestionItem.textContent = suggestion;
//             suggestionItem.classList.add('suggestion-item');
//             suggestionItem.addEventListener('click', () => {
//                 document.getElementById(inputFieldId).value = suggestion;
//                 suggestionContainer.innerHTML = '';  // Clear suggestions after selection
//             });
//             suggestionContainer.appendChild(suggestionItem);
//         });
//     }
// }

// **Event Listener for City Inputs**
// fromCity.addEventListener("input", async () => {
//     const state = fromState.value;
//     const suggestions = await fetchCitySuggestions(fromCity.value, state);
//     renderCitySuggestions(suggestions, 'from-city');
// });

// toCity.addEventListener("input", async () => {
//     const state = toState.value;
//     const suggestions = await fetchCitySuggestions(toCity.value, state);
//     renderCitySuggestions(suggestions, 'to-city');
// });

// **Calculate Distance and Price**
async function calculateDistance(from, to) {
    const fromCoords = await getCoordinates(from);
    const toCoords = await getCoordinates(to);

    if (fromCoords && toCoords) {
        const distance = calculateHaversineDistance(fromCoords, toCoords); // Returns distance in kilometers
        return distance;
    }
    return 0;
}

// **Get Coordinates from OpenCage API**
async function getCoordinates(location) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${OPENCAGE_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { lat, lng };
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
    }
    return null;
}

// **Haversine Formula to Calculate Distance between Two Coordinates**
function calculateHaversineDistance(coords1, coords2) {
    const R = 6371; // Earth radius in km
    const lat1 = coords1.lat * Math.PI / 180;
    const lat2 = coords2.lat * Math.PI / 180;
    const lon1 = coords1.lng * Math.PI / 180;
    const lon2 = coords2.lng * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

// **Handle Calculate Button**
calculateBtn.addEventListener("click", async () => {
    let loggedIn = localStorage.getItem('loggedIn');
    if(!loggedIn){
        alert('Please login to continue');
        return
    }
    const from = `${fromCity.value}, ${fromState.value}, India`;
    const to = `${toCity.value}, ${toState.value}, India`;

    console.log(`Calculating distance from: ${from}, to: ${to}`);

    distance = await calculateDistance(from, to);
    console.log("Calculated distance:", distance);

    if (distance > 0) {
        totalPrice = distance * 10; // ₹3 per km
        estimatedKmElement.textContent = `Estimated Distance: ${parseInt(distance)} km`;
        priceElement.textContent = `₹${parseInt(totalPrice)}`;
        priceElement.style.display = "block";
        bookNowBtn.style.display = "block"; // Display the "Book Now" button
    } else {
        alert("Unable to calculate the distance. Please check the city names.");
    }
});

// **Handle Book Now Button**
bookNowBtn.addEventListener("click", () => {
    paymentModal.style.display = "block";  // Open the payment modal
});

// **Handle Payment Button**
payBtn.addEventListener("click", async () => {
    if (!userUID) {
        alert("Please log in first.");
        return;
    }

    const trackingId = nanoid(10);  // Generate a unique tracking ID for the shipment
    const currentDate = new Date().toISOString().split('T')[0];  // Get the current date in YYYY-MM-DD format

    // Shipment data to store in Firestore
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3); // 3 days from today

    const shipmentData = {
        trackingId,
        from: { city: fromCity.value, state: fromState.value },
        to: { city: toCity.value, state: toState.value },
        distance,
        price: totalPrice,
        bookingDate: new Date().toISOString(),
        estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),  // Store the estimated delivery date
        status: 'Pending',  // Initial status when booking
    };

    try {
        // Correct path: "shipments/{userUID}/bookings/{trackingId}"
        const userShipmentsRef = doc(db, "shipments", userUID, "bookings", trackingId);

        // Use setDoc to store shipment data in the "trackingId" document
        await setDoc(userShipmentsRef, shipmentData);

        alert("Booking Successful!");

        // Send confirmation email to the user (optional)
        // sendConfirmationEmail(userUID, trackingId, shipmentData);
        window.location.href = `../../pages/booking-confirmation.html?trackingid=${trackingId}`;

        // After successful booking, close the modal or proceed to the next step
        paymentModal.style.display = "none";
    } catch (error) {
        console.error("Error storing booking:", error);
        alert("There was an error storing your booking. Please try again.");
    }
});


// **Send Confirmation Email to the User using EmailJS**
// async function sendConfirmationEmail(trackingId, shipmentData) {
//     try {
//       const user = auth.currentUser;  // Get the currently logged-in user
  
//       if (!user || !user.email) {
//         // Check if the user is not logged in or if email is missing
//         throw new Error("User is not logged in or email is not available.");
//       }
  
//       const userEmail = user.email;  // Access user's email directly
  
//       // Log user email to confirm it's being fetched
//       console.log("User Email:", userEmail);
  
//       if (!userEmail) {
//         throw new Error("User email is missing.");
//       }
  
//       // Ensure the shipment data contains the required information
//       const fromCity = shipmentData.from?.city || 'Not Provided';
//       const fromState = shipmentData.from?.state || 'Not Provided';
//       const toCity = shipmentData.to?.city || 'Not Provided';
//       const toState = shipmentData.to?.state || 'Not Provided';
  
//       // Check if estimatedDeliveryDate exists and is valid
//       let estimatedReceivingDate = "Not Provided";  // Default value
  
//       if (shipmentData.estimatedDeliveryDate) {
//         const date = new Date(shipmentData.estimatedDeliveryDate);
//         if (!isNaN(date.getTime())) {
//           estimatedReceivingDate = date.toISOString().split('T')[0];  // Format date to YYYY-MM-DD
//         }
//       }
  
//       // Define the email template parameters
//       const emailParams = {
//         to_email: userEmail,  // Ensure email is valid
//         tracking_id: trackingId,
//         from_city: fromCity,
//         from_state: fromState,
//         to_city: toCity,
//         to_state: toState,
//         total_price: shipmentData.price || 'Not Provided',
//         estimated_receiving_date: estimatedReceivingDate,
//       };
  
//       // Log email parameters to debug
//       console.log("Email Params:", emailParams);
  
//       // Send the email using EmailJS
//       const result = await emailjs.send(
//         "service_6tzyinn",    // EmailJS service ID
//         "template_eeiprf9",    // EmailJS template ID
//         emailParams,           // Parameters to replace in the template
//         "fhKVrW2Ae-NFbTiOb"   // EmailJS user ID
//       );
  
//       console.log("Email sent successfully:", result);
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   }
  
  



// **Handle Close Modal Button**
closeModal.addEventListener("click", () => {
    paymentModal.style.display = "none"; // Close the payment modal
});

// **Firebase Authentication (for getting user UID)**
onAuthStateChanged(auth, user => {
    if (user) {
        userUID = user.uid;
    } else {
        userUID = null;
    }
});

document.getElementById('search-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    let trackingId = document.getElementById('tracking-id').value;
    if(!trackingId.length){
        alert('Please provide a tracking id');
    }
    window.location.href = `../../pages/tracking.html?trackingid=${trackingId}`;
});