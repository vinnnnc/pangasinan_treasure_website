//signup

const loginToSignupBtn = document.querySelectorAll(".login-signup-btn");
const loginBrand = document.querySelector(".login-brand");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginNameField = document.getElementById("login-username-field");
const loginPassField = document.getElementById("login-password-field");
const signupFullnameField = document.getElementById("signup-fullname-field");
const signupUsernameField = document.getElementById("signup-username-field");
const signupPhoneField = document.getElementById("signup-phone-field");
const signupEmailField = document.getElementById("signup-email-field");
const signupBdayField = document.getElementById("signup-bday-field");
const signupAddressField = document.getElementById("signup-address-field");
const signupGenderField = document.getElementById("signup-gender-field");
const signupPassField = document.getElementById("signup-password-field");
const signupForm = document.getElementById("signup-form");

var isPasswordStrong = false;
var isNameEmpty = true;
var isPassEmpty = true;

loginBtn.addEventListener("click", () => {
  login(loginNameField.value, loginPassField.value);
  console.log(loginNameField.value, loginPassField.value);
});

signupPassField.addEventListener("input", () => {
  console.log(checkPasswordStrength(loginPassField.value));
  loginPassField.style.borderColor = "var(--secondary-color)";
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  const formData = new FormData(event.target);
  const fullname = formData.get("fullname");
  const username = formData.get("username");
  const phonenumber = formData.get("phonenumber");
  const email = formData.get("email");
  const birthdate = formData.get("birthdate");
  const address = formData.get("address");
  const gender = formData.get("gender");
  const password = formData.get("password");

  if (!isPasswordStrong) {
    alert(checkPasswordStrength(password));
    return;
  }

  registerUser(
    fullname,
    username,
    phonenumber,
    email,
    birthdate,
    address,
    gender,
    password
  );
});

function checkPasswordStrength(password) {
  // Define regular expressions for password requirements
  const minLength = 8; // Minimum length
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const digitRegex = /\d/; // At least one digit

  // Check password length
  if (password.length < minLength) {
    isPasswordStrong = false;
    return "Password should be at least " + minLength + " characters long.";
  }

  // Check uppercase letter
  if (!uppercaseRegex.test(password)) {
    isPasswordStrong = false;
    return "Password should contain at least one uppercase letter.";
  }

  // Check lowercase letter
  if (!lowercaseRegex.test(password)) {
    isPasswordStrong = false;
    return "Password should contain at least one lowercase letter.";
  }

  // Check digit
  if (!digitRegex.test(password)) {
    isPasswordStrong = false;
    return "Password should contain at least one digit.";
  }

  // Password meets all requirements
  isPasswordStrong = true;
  return "Password is strong.";
}

function changeLogin() {
  const signupWindow = document.querySelector(".login-window");
  signupWindow.classList.toggle("change-window");
  loginBrand.classList.toggle("small");
}

loginToSignupBtn[0].addEventListener("click", () => {
  changeLogin();
});

loginToSignupBtn[1].addEventListener("click", () => {
  changeLogin();
});
