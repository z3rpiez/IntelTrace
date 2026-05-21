// app.js — Global scripts for UI

// 1. Page Fade-In Effect
document.addEventListener('DOMContentLoaded', function () {
  // Give the browser a tiny delay, then fade in the body
  setTimeout(function() {
      document.body.classList.add('page-visible');
  }, 50);
});

// 2. Smooth Scrolling for internal links
let allLinks = document.querySelectorAll('a[href^="#"]');
for (let i = 0; i < allLinks.length; i++) {
  allLinks[i].addEventListener('click', function (event) {
    event.preventDefault();
    let targetId = this.getAttribute('href');
    let targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 3. Back to Top Button Logic
let topButton = document.getElementById('backToTop');
if (topButton) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
        topButton.classList.add('visible');
    } else {
        topButton.classList.remove('visible');
    }
  });

  topButton.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}