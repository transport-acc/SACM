import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
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
const db = getFirestore();
let loader = document.querySelector('.loader-container');
const responseMessage = document.getElementById("responseMessage");
const body = document.querySelector('body');
body.style.overflowY = 'hidden';
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Auto-fill Name and Email
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        
        document.getElementById("name").value =  user.displayName || userData.name || 'User';
        document.getElementById("email").value = user.email;
        loader.style.display = 'none'
        body.style.overflowY = 'auto';
    }
    else{
        loader.style.display = 'none'
        body.style.overflowY = 'auto';
    }
});

// Send email on form submit
// Get the form and input elements
const contactForm = document.getElementById("contactForm");
const subjectInput = document.getElementById("subject");
const queryInput = document.getElementById("query");
const submitButton = document.getElementById("submit-button");
const errorMessage = document.getElementById('errorMessage');
// Validation function for the form fields
// function validateForm() {
//     let isValid = true;
//     let errorMessage = "";
    
//     // Validate Subject
//     const subject = subjectInput.value.trim();
//     if (!subject || subject.length < 5 || subject.length > 100) {
//         isValid = false;
//         errorMessage = "Subject must be between 5 and 100 characters.";
//         subjectInput.style.borderColor = "#FF6F61"; // Highlight border in red
//     } else {
//         subjectInput.style.borderColor = "#ccc"; // Reset border color
//     }

//     // Validate Query
//     const query = queryInput.value.trim();
//     if (!query || query.length < 10 || query.length > 500) {
//         isValid = false;
//         errorMessage = "Query must be between 10 and 500 characters.";
//         queryInput.style.borderColor = "#FF6F61"; // Highlight border in red
//     } else {
//         queryInput.style.borderColor = "#ccc"; // Reset border color
//     }

//     // Show error message if validation fails
//     if (!isValid) {
//         alert(errorMessage); // Or display the error message in a div
//     }
    
//     return isValid;
// }



// Attach the validation to the form submission event
contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from submitting if validation fails

        // Proceed with form submission (e.g., sending the email)
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                errorMessage.textContent = ''
                // Auto-fill Name and Email
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                
                document.getElementById("name").value =  user.displayName || userData.name || 'User';
                document.getElementById("email").value = user.email;
                sendEmail(document.getElementById("name").value,user.email); // Replace with your actual email sending function
            }
            else{
                errorMessage.textContent = 'Please login to rise a query';
            }
        });
    
});

// Email sending function (this is where you'd use EmailJS)
function sendEmail(userName,userEmail) {
    const emailParams = {
        user_name: userName,
        user_email: userEmail,
        subject: subjectInput.value,
        user_query: queryInput.value,
    };

    emailjs.send('service_6tzyinn', 'template_z77q868', emailParams, 'fhKVrW2Ae-NFbTiOb')
    .then((response) => {
        console.log('Email sent successfully:', response);
            // Show success message or clear the form
            document.getElementById('responseMessage').textContent = 'Thanks for contacting us. Our team will connect with you zoon.'
            contactForm.reset()
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            // Show error message
        });
    }
    