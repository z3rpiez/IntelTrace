// contact.js — Contact page form logic

document.addEventListener('DOMContentLoaded', function () {

  // 1. Character Counter
  let msgArea = document.getElementById('contactMessage');
  let charCount = document.getElementById('charCount');

  if (msgArea) {
      msgArea.addEventListener('input', function () {
        let currentLength = msgArea.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > 500) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = 'gray';
        }
      });
  }

  // 2. Form Validation
  let submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        let name = document.getElementById('contactName').value.trim();
        let email = document.getElementById('contactEmail').value.trim();
        let message = document.getElementById('contactMessage').value.trim();
        
        let isValid = true;

        // Check Name
        if (name === '') {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nameError').style.display = 'none';
        }

        // Check Email
        if (email === '' || email.indexOf('@') === -1) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
        }

        // Check Message
        if (message === '' || message.length < 10) {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('messageError').style.display = 'none';
        }

        // If everything is good, show success banner
        if (isValid === true) {
            document.getElementById('formSuccess').style.display = 'block';
            
            // Clear inputs
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
            
            // Hide banner after 5 seconds
            setTimeout(function() {
                document.getElementById('formSuccess').style.display = 'none';
            }, 5000);
        }
      });
  }
});