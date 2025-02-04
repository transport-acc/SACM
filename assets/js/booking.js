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
const fromPin = document.getElementById("from-pincode");
const toState = document.getElementById("to-state");
const toCity = document.getElementById("to-city");
const toPin = document.getElementById("to-pincode");
const calculateBtn = document.getElementById("calculate");
const priceElement = document.getElementById("price");
const bookNowBtn = document.getElementById("book-now");
const paymentModal = document.querySelector(".payment-modal");
const payBtn = document.querySelector(".purchase--btn");
const closeModal = document.querySelector(".close-modal");
const productType = document.getElementById('product-type');
const phone = document.getElementById('phone');
const spinner = document.getElementById('spinner')
let userUID = null;
let estimatedKmElement = document.getElementById("estimated-km");
let totalPrice = 0;
let distance = 0;
let fromCityError = document.getElementById('from-city-error');
let fromStateError = document.getElementById('from-state-error');
let fromPinError = document.getElementById('from-pincode-error');
let toCityError = document.getElementById('to-city-error');
let toStateError = document.getElementById('to-state-error');
let toPinError = document.getElementById('to-pincode-error');
let productError = document.getElementById('product-error');
let phoneError = document.getElementById('phone-error');
// OpenCage API Key
const OPENCAGE_API_KEY = "0f53a657ecf14b4bb60007be6e669cb7";  // Get your OpenCage API key
spinner.style.display = 'none'
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
        return parseInt(distance);
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
    spinner.style.display = 'inline';
    let loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
        alert('Please login to continue');
        return
    }
    
    const from = `${fromCity.value}, ${fromState.value}, India`;
    const to = `${toCity.value}, ${toState.value}, India`;
    
    console.log(`Calculating distance from: ${from}, to: ${to}`);
    
    distance = await calculateDistance(from, to);
    console.log("Calculated distance:", distance);
    
    if (distance > 0) {
        totalPrice = distance * 10; // ₹10 per km
        estimatedKmElement.textContent = `Estimated Distance: ${parseInt(distance)} km`;
        priceElement.textContent = `₹${parseInt(totalPrice)}`;
        priceElement.style.display = "block";
        bookNowBtn.style.display = "block"; // Display the "Book Now" button
    } else {
        alert("Unable to calculate the distance. Please check the city names.");
    }
    spinner.style.display = 'none';
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
        productType: productType.value,
        phone: phone.value,
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

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let trackingId = document.getElementById('tracking-id').value;
    if (!trackingId.length) {
        alert('Please provide a tracking id');
    }
    window.location.href = `../../pages/tracking.html?trackingid=${trackingId}`;
});


const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Function to show suggestions
function showSuggestions(inputField, suggestionsContainer) {
    let inputValue = inputField.value.toLowerCase();
    let filteredStates = states.filter(state => state.toLowerCase().includes(inputValue));

    suggestionsContainer.innerHTML = "";
    suggestionsContainer.style.display = filteredStates.length ? "block" : "none";

    filteredStates.forEach(state => {
        let div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = state;
        div.addEventListener("click", () => {
            inputField.value = state;  // Set the input value to the selected state
            suggestionsContainer.innerHTML = ""; // Clear suggestions
            suggestionsContainer.style.display = "none"; // Hide suggestions
        });
        suggestionsContainer.appendChild(div);
    });
}

// Function to initialize event listeners for a given input field and suggestion box
function setupAutoComplete(inputId, suggestionsId) {
    const inputField = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsId);

    inputField.addEventListener("input", () => showSuggestions(inputField, suggestionsContainer));
    inputField.addEventListener("blur", () => setTimeout(() => suggestionsContainer.style.display = "none", 500));
}

// Set up autocomplete for From State and To State
setupAutoComplete("from-state", "from-state-suggestions");
setupAutoComplete("to-state", "to-state-suggestions");

restrictCharacters();
function restrictCharacters() {
    fromCity.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^a-zA-Z,\s]/g, ''); // Restrict anything other than alphabet, whitespace, and comma
        event.target.value = event.target.value.replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
    });

    // From State - Allow alphabet and spaces but restrict multiple spaces
    fromState.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only alphabets and spaces
        event.target.value = event.target.value.replace(/\s{2,}/g, ' '); // Restrict continuous spaces
    });

    // From Pincode - Only allow 6 characters starting with 1-9
    fromPin.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^1-9\d]/g, ''); // Allow only digits starting from 1-9
        event.target.value = event.target.value.slice(0, 6); // Limit to 6 characters
    });

    // To City - Restrict alphabet, single whitespace, and comma
    toCity.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^a-zA-Z,\s]/g, ''); // Restrict anything other than alphabet, whitespace, and comma
        event.target.value = event.target.value.replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
    });

    // To State - Allow alphabet and spaces but restrict multiple spaces
    toState.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only alphabets and spaces
        event.target.value = event.target.value.replace(/\s{2,}/g, ' '); // Restrict continuous spaces
    });

    // To Pincode - Only allow 6 characters starting with 1-9
    toPin.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^1-9\d]/g, ''); // Allow only digits starting from 1-9
        event.target.value = event.target.value.slice(0, 6); // Limit to 6 characters
    });

    // Product Name - Only alphabet
    productType.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^a-zA-Z]/g, ''); // Only allow alphabetic characters
    });

    // Phone Number - Allow numbers, should start with 6-9, and only 10 digits
    phone.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/[^6-9\d]/g, ''); // Allow digits starting with 6-9
        if (event.target.value.length > 10) {
            event.target.value = event.target.value.slice(0, 10); // Limit to 10 digits
        }
    });
}


const GEOAPIFY_API_KEY = 'fbbafba84a6c4384b95508c4e094d634';  // Replace with your actual Geoapify API key

// Function to fetch city suggestions using Geoapify's autocomplete API
async function getCitySuggestions(query) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Remove undefined or incomplete suggestions
    const filteredResults = data.results.filter(result => result.city);

    // Remove duplicates based on the city name
    const uniqueResults = [];
    const seenCities = new Set();

    filteredResults.forEach(result => {
        if (!seenCities.has(result.city)) {
            seenCities.add(result.city);
            uniqueResults.push(result);  // Add unique city
        }
    });

    return uniqueResults;
}

// Function to handle city suggestion selection
function selectCity(inputElement, city) {
    inputElement.value = city.city; // Set the input field value to the selected city
    closeSuggestions();  // Close suggestions once a city is selected
}

// Function to display city suggestions
function displaySuggestions(inputElement, suggestions) {
    const suggestionList = document.getElementById(`${inputElement.id}-suggestions`);
    suggestionList.innerHTML = '';  // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion.city; // Show city name
        suggestionItem.onclick = () => selectCity(inputElement, suggestion);  // Add click event for selecting city
        suggestionList.appendChild(suggestionItem);
    });

    // Show or hide the suggestion box based on the number of suggestions
    suggestionList.style.display = suggestions.length > 0 ? 'block' : 'none';
}

// Function to close the suggestions box
function closeSuggestions() {
    const allSuggestionBoxes = document.querySelectorAll('.autocomplete-container');
    allSuggestionBoxes.forEach(box => {
        box.style.display = 'none'; // Hide all suggestion boxes
    });
}

// Event Listener for From City Input
// const fromCity = document.getElementById('from-city');
fromCity.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length >= 3) {
        const suggestions = await getCitySuggestions(query);
        displaySuggestions(fromCity, suggestions);  // Display suggestions for "from city"
    } else {
        closeSuggestions();  // Close suggestions when query length is less than 3
    }
});

// Event Listener for To City Input
// const toCity = document.getElementById('to-city');
toCity.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length >= 3) {
        const suggestions = await getCitySuggestions(query);
        displaySuggestions(toCity, suggestions);  // Display suggestions for "to city"
    } else {
        closeSuggestions();  // Close suggestions when query length is less than 3
    }
});
