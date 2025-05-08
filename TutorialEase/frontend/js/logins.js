document.addEventListener("DOMContentLoaded", function () {
  // UI Elements
  const upButton = document.getElementById('up-button');
  const inButton = document.getElementById('in-button');
  const upDiv = document.querySelector('.up');
  const inDiv = document.querySelector('.in');
  const loginContainer = document.querySelector('.lower-container.login');
  const signupContainer = document.querySelector('.lower-container.logup');
  const toSignup = document.getElementById('to-signup');
  const toSignin = document.getElementById('to-signin');
  
  // Form Elements
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  
  // Input Elements - Signup
  const fnameInput = document.getElementById('fname');
  const lnameInput = document.getElementById('lname');
  const signupEmailInput = document.getElementById('signup-email');
  const phoneInput = document.getElementById('phone');
  const signupPasswordInput = document.getElementById('signup-password');
  const signupErrorMsg = document.getElementById('signup-error-msg');
  
  // Input Elements - Login
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginErrorMsg = document.getElementById('login-error-msg');

  // Initialize display
  signupContainer.style.display = 'none';
  loginContainer.style.display = 'block';
  
  // Default colors
  const activeColor = 'rgb(199, 192, 182)';
  const defaultColor = 'rgb(230, 229, 228)'; // Default color from upper-container

  // Set initial active tab (sign-in)
  inDiv.style.backgroundColor = activeColor;
  upDiv.style.backgroundColor = defaultColor;

  // Show elements with animation
  document.querySelector('.sign-image').classList.add('show');
  document.querySelector('.sign-container').classList.add('show');

  // Function to set active tab
  function setActiveTab(isSignIn) {
      if (isSignIn) {
          // Highlight sign-in tab
          upDiv.style.backgroundColor = defaultColor;
          inDiv.style.backgroundColor = activeColor;
          // Show sign-in form, hide sign-up form
          signupContainer.style.display = 'none';
          loginContainer.style.display = 'block';
      } else {
          // Highlight sign-up tab
          inDiv.style.backgroundColor = defaultColor;
          upDiv.style.backgroundColor = activeColor;
          // Show sign-up form, hide sign-in form
          loginContainer.style.display = 'none';
          signupContainer.style.display = 'block';
      }
  }

  // Toggle between signup and signin forms
  upButton.addEventListener('click', function(e) {
      e.preventDefault();
      setActiveTab(false); // Activate sign-up tab
  });

  inButton.addEventListener('click', function(e) {
      e.preventDefault();
      setActiveTab(true); // Activate sign-in tab
  });

  toSignup.addEventListener('click', function(e) {
      e.preventDefault();
      setActiveTab(false); // Activate sign-up tab
  });

  toSignin.addEventListener('click', function(e) {
      e.preventDefault();
      setActiveTab(true); // Activate sign-in tab
  });

  // Validation functions
  const validateInput = (input, messageElement, validationFn) => {
      input.addEventListener('input', () => {
          const message = validationFn(input.value);
          messageElement.textContent = message;
      });
  };

  const isValidEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
  };

  const isValidPhone = (phone) => {
      const re = /^[0-9]{10}$/; // Adjust regex based on desired phone format
      return re.test(String(phone));
  };

  const validateName = (value) => {
      if (value.trim() === '') {
          return 'This field is required.';
      } else if (value.length < 3) {
          return 'Name must be at least 3 characters long.';
      } else if (value.length > 20) {
          return 'Name must be less than 20 characters long.';
      } else {
          return '';
      }
  };

  const validateEmail = (value) => !isValidEmail(value) ? 'Invalid email format.' : '';
  const validatePhone = (value) => !isValidPhone(value) ? 'Invalid phone number.' : '';
  const validatePassword = (value) => value.length < 6 ? 'Password must be at least 6 characters long.' : '';

  // Attach validation to sign-up inputs
  validateInput(fnameInput, document.getElementById('fname-msg'), validateName);
  validateInput(lnameInput, document.getElementById('lname-msg'), validateName);
  validateInput(signupEmailInput, document.getElementById('signup-email-msg'), validateEmail);
  validateInput(phoneInput, document.getElementById('phone-msg'), validatePhone);
  validateInput(signupPasswordInput, document.getElementById('signup-password-msg'), validatePassword);

  // Attach validation to sign-in inputs
  validateInput(loginEmailInput, document.getElementById('login-email-msg'), validateEmail);
  validateInput(loginPasswordInput, document.getElementById('login-password-msg'), validatePassword);

  // Handle signup form submission
  signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      const fnameMsg = validateName(fnameInput.value);
      const lnameMsg = validateName(lnameInput.value);
      const emailMsg = validateEmail(signupEmailInput.value);
      const phoneMsg = validatePhone(phoneInput.value);
      const passwordMsg = validatePassword(signupPasswordInput.value);
      
      // Check if there are any validation errors
      if (fnameMsg || lnameMsg || emailMsg || phoneMsg || passwordMsg) {
          signupErrorMsg.textContent = 'Please fix the errors in the form.';
          return;
      }
      
      // Prepare form data
      const formData = {
          fname: fnameInput.value,
          lname: lnameInput.value,
          email: signupEmailInput.value,
          phone: phoneInput.value,
          password: signupPasswordInput.value
      };
      
      // Send data to server
      fetch('../../backend/login.php?action=signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
            // Redirect to dashboard instead of showing alert
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                // Fallback if no redirect URL is provided
                alert(data.message);
                signupForm.reset();
                setActiveTab(true);
            }
        } else {
            signupErrorMsg.textContent = data.message;
        }
      })
      .catch(error => {
          console.error('Error:', error);
          signupErrorMsg.textContent = 'An error occurred. Please try again.';
      });
  });

  // Handle login form submission
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      const emailMsg = validateEmail(loginEmailInput.value);
      const passwordMsg = validatePassword(loginPasswordInput.value);
      
      // Check if there are any validation errors
      if (emailMsg || passwordMsg) {
          loginErrorMsg.textContent = 'Please fix the errors in the form.';
          return;
      }
      
      // Prepare form data
      const formData = {
          email: loginEmailInput.value,
          password: loginPasswordInput.value
      };
      
      // Send data to server
      fetch('../../backend/login.php?action=login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              // Redirect to dashboard
              window.location.href = data.redirect;
          } else {
              loginErrorMsg.textContent = data.message;
          }
      })
      .catch(error => {
          console.error('Error:', error);
          loginErrorMsg.textContent = 'An error occurred. Please try again.';
      });
  });
});