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

$("body").on("submit", "form", function () {
  $(this).submit(function () {
    return false;
  });
  return true;
});

loginBtn.addEventListener("click", () => {
  login(loginNameField.value, loginPassField.value);
  console.log(loginNameField.value, loginPassField.value);
});

signupPassField.addEventListener("input", () => {
  isPasswordStrong = checkPasswordStrength(signupPassField.value);
  console.log(isPasswordStrong);
  console.log(signupPassField.value);
  signupPassField.style.borderColor = "var(--secondary-color)";
});

signupForm.addEventListener("submit", async function (event) {
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
  signupBtn.classList.add("disabled");

  const result = await registerUser(
    fullname,
    username,
    phonenumber,
    email,
    birthdate,
    address,
    gender,
    password
  );
  if (!result) signupBtn.classList.remove("disabled");
});

function checkPasswordStrength(password) {
  // Define regular expressions for password requirements
  const minLength = 8; // Minimum length
  const maxLength = 20; // Maximum length
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const digitRegex = /\d/; // At least one digit
  const forbiddenCharsRegex = /[ :;,'\"\/|]/; // Forbidden characters and spaces

  // Check password length
  if (password.length < minLength) {
    return "Password should be at least " + minLength + " characters long.";
  }

  if (password.length > maxLength) {
    return "Password should be no more than " + maxLength + " characters long.";
  }

  // Check uppercase letter
  if (!uppercaseRegex.test(password)) {
    return "Password should contain at least one uppercase letter.";
  }

  // Check lowercase letter
  if (!lowercaseRegex.test(password)) {
    return "Password should contain at least one lowercase letter.";
  }

  // Check digit
  if (!digitRegex.test(password)) {
    return "Password should contain at least one digit.";
  }

  // Check for forbidden characters and spaces
  if (forbiddenCharsRegex.test(password)) {
    return "Password should not contain spaces or any of the following characters: :;,'\"/|.";
  }

  // Password meets all requirements
  return "Password is strong.";
}

// Example usage:
// const password = "YourPassword123";
// const result = checkPasswordStrength(password);
// console.log(result);

function changeLogin() {
  const signupWindow = document.querySelector(".login-window");
  signupWindow.classList.toggle("change-window");
  loginBrand.classList.toggle("small");
}
console.log(window.location.pathname);
if (window.location.pathname === "/signup") {
  changeLogin();
}
loginToSignupBtn[0].addEventListener("click", () => {
  changeLogin();
});

loginToSignupBtn[1].addEventListener("click", () => {
  changeLogin();
});
