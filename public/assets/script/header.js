loginStatus()
  .then((loggedIn) => {
    const profileBtn = document.getElementById("profile-btn");
    const profileBtnSpan = document.querySelector("#profile-btn span");
    const sellerLink = document.getElementById("seller-link");
    const logoutLink = document.getElementById("logout-link");
    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");
    if (loggedIn) {
      console.log("User is logged in:", loggedIn);
      profileBtn.classList.remove("logged-out");
      profileBtnSpan.classList.add("hidden");
      sellerLink.classList.remove("hidden");
      logoutLink.classList.remove("hidden");
      signupLink.classList.add("hidden");
      loginLink.classList.add("hidden");
      profileBtn.href = "/profile";
    } else {
      console.log("User is logged out");
      profileBtn.classList.add("logged-out");
      profileBtnSpan.classList.remove("hidden");
      sellerLink.classList.add("hidden");
      logoutLink.classList.add("hidden");
      signupLink.classList.remove("hidden");
      loginLink.classList.remove("hidden");
      profileBtn.href = "/login";
    }
  })
  .catch((error) => {
    console.error("Error checking authentication status:", error);
  });

document.getElementById("logout-link").addEventListener("click", () => {
  event.preventDefault();
  logout(); // Call the logout function when the logout link is clicked
  //   refreshStatus(); // Refresh the status after logout
});
