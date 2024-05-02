//signup

const loginToSignupBtn = document.querySelectorAll(".login-signup-btn");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginNameField = document.getElementById("login-username-field");
const loginPassField = document.getElementById("login-password-field");
const signupNameField = document.getElementById("signup-username-field");
const signupPassField = document.getElementById("signup-email-field");
const signupPhoneField = document.getElementById("signup-phone-field");
const signupEmailField = document.getElementById("signup-password-field");
var isPasswordStrong = false;
var isNameEmpty = true;
var isPassEmpty = true;

loginPassField.addEventListener("input", () => {
  console.log(checkPasswordStrength(loginPassField.value));
  loginPassField.style.borderColor = "var(--secondary-color)";
});

const registerUser = async (username, phonenumber, email, password) => {
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, phonenumber, password }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message); // User registered successfully
    } else {
      console.error(data.error); // Error message from the server
    }
  } catch (err) {
    console.error("Error:", err);
    alert(err);
  }
};

signupBtn.addEventListener("click", () => {
  let incomplete = false;
  if (signupNameField.value == "") {
    signupNameField.style.borderColor = "red";
    incomplete = true;
  }
  if (signupEmailField.value == "") {
    signupEmailField.style.borderColor = "red";
    incomplete = true;
  }
  if (signupPhoneField.value == "") {
    signupPhoneField.style.borderColor = "red";
    incomplete = true;
  }
  if (signupPassField.value == "") {
    signupPassField.style.borderColor = "red";
    incomplete = true;
  }
  if (incomplete == true) {
    alert("Fill all empty fields!");
    return;
  }
  // if (!isPasswordStrong) {
  //   alert(checkPasswordStrength(signupPassField.value));
  //   return;
  // }
  registerUser(
    signupNameField.value,
    signupEmailField.value,
    signupPhoneField.value,
    signupPassField.value
  );
  // console.log("User" + username + " registered successfuly!");
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
}

loginToSignupBtn[0].addEventListener("click", () => {
  changeLogin();
});

loginToSignupBtn[1].addEventListener("click", () => {
  changeLogin();
});
