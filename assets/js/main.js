// Carousel Logic
let carouselIndex = 0;
const carouselItems = document.querySelectorAll('.carousel-item');

// Show the first image initially
carouselItems[carouselIndex].style.display = 'block';

// Function to cycle through images
function showNextImage() {
    carouselItems[carouselIndex].style.display = 'none'; // Hide current image
    carouselIndex = (carouselIndex + 1) % carouselItems.length; // Loop back to first image
    carouselItems[carouselIndex].style.display = 'block'; // Show next image
}

// Set interval for carousel rotation
setInterval(showNextImage, 3000); // Change image every 3 seconds

