// Hamburger Menu Logic
const menuIcon = document.getElementById('menu-icon');
const menuList = document.getElementById('menu-list');
const paymentBtn = document.querySelectorAll('.payment--options button');
const menuLiks = menuList.querySelectorAll('li');

paymentBtn.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        e.preventDefault();
        document.querySelector('.payment-error').style.display = 'inline'
    })
})
menuIcon.addEventListener('click', () => {
    if (menuList.style.left === '0px') {
        menuList.style.left = '-100vw'; // Hide menu
        menuIcon.classList.add('fa-bars'); // Change icon to hamburger
        menuIcon.classList.remove('fa-xmark'); // Remove close icon
    } else {
        menuList.style.left = '0px'; // Show menu
        menuIcon.classList.remove('fa-bars'); // Remove hamburger icon
        menuIcon.classList.add('fa-xmark'); // Add close icon
    }
});

menuLiks.forEach((link)=>{
    link.addEventListener('click',()=>{
        menuList.style.left = '-100vw'; // Hide menu
        menuIcon.classList.add('fa-bars'); // Change icon to hamburger
        menuIcon.classList.remove('fa-xmark'); // Remove close icon
    })
})

// Sidebar Toggle Logic
const profileBtn = document.getElementById('profile-btn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');

profileBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // Show sidebar
});
document.addEventListener('click',(e)=>{
    if(!sidebar.contains(e.target) && !profileBtn.contains(e.target)){
        sidebar.classList.remove('active')
    }
})

