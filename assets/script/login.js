const signupBtn = document.querySelectorAll(".login-signup-btn");

function changeLogin() {
  const signupWindow = document.querySelector(".login-window");
  signupWindow.classList.toggle("change-window");
}

signupBtn[0].addEventListener("click", () => {
  //   signupWindow.classList.toggle("create-account");
  changeLogin();
});

signupBtn[1].addEventListener("click", () => {
  //   signupWindow.classList.toggle("create-account");
  changeLogin();
});
