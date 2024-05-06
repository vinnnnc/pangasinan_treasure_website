const profileBtn = document.getElementById("profile-btn");
const profileBtnSpan = document.querySelector("#profile-btn span");
const sellerLink = document.getElementById("seller-link");
const logoutLink = document.getElementById("logout-link");
const signupLink = document.getElementById("signup-link");
const loginLink = document.getElementById("login-link");
const cartBtn = document.getElementById("cart-btn");

cartBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission
  accessCartPage();
});

if (loginStatus()) {
  console.log("User is logged in");
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

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const searchValue = document.getElementById("search-bar").value.trim();
  if (!searchValue) {
    return; // Ignore empty search
  }

  const searchUrl = `/search?productName=${encodeURIComponent(searchValue)}`;
  window.location.href = searchUrl; // Redirect to search page with search query
});

document.getElementById("logout-link").addEventListener("click", () => {
  event.preventDefault();
  logout(); // Call the logout function when the logout link is clicked
  //   refreshStatus(); // Refresh the status after logout
});

async function checkSellerRegistration(userId) {
  try {
    const response = await fetch(`/api/v1/users/${userId}/isRegisteredSeller`);
    if (!response.ok) {
      throw new Error("Failed to check seller registration");
    }
    const data = await response.json();
    return data.isRegisteredSeller;
  } catch (error) {
    console.error("Error checking seller registration:", error.message);
    return false; // Default to false if there's an error
  }
}

async function sellerDashboardBtn(userId) {
  const isRegisteredSeller = await checkSellerRegistration(userId);
  if (isRegisteredSeller) {
    // User is registered as a seller, redirect to the seller page
    window.location.href = `/seller/dashboard/${userId}`; // Replace with actual seller page route
  } else {
    // User is not registered as a seller, redirect to the seller registration page
    window.location.href = "/seller-registration"; // Replace with actual seller registration route
  }
}

sellerLink.addEventListener("click", (e) => {
  e.preventDefault();
  const userId = localStorage.getItem("userId");
  sellerDashboardBtn(userId);
});
