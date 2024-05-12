// Side Bar
const dropdownBtn = document.querySelectorAll(".dropdown-title");
const dropdown = document.querySelectorAll(".dropdown");
const dropdownOptions = document.querySelectorAll(".dropdown-option");

dropdownBtn.forEach((element, index) => {
  element.addEventListener("click", () => {
    dropdown[index].classList.toggle("collapsed");
  });
});

dropdownOptions.forEach((element, index) => {
  element.addEventListener("click", () => {
    if (!element.classList.contains("dropdown-title"))
      dropdownOptions.forEach((element) => {
        element.classList.remove("active");
      });
    if (!element.classList.contains("dropdown-title")) {
      element.classList.add("active");
      element.parentElement.classList.add("active");
    }
  });
});

// Load Contents
const loadOverview = document.getElementById("dashboard-overview");
const loadManageProduct = document.getElementById("manage-products");
const loadAddProduct = document.getElementById("add-product");
const loadOrders = document.getElementById("orders");
const loadReviews = document.getElementById("reviews");
const loadStoreSettings = document.getElementById("store-settings");
const loadAccountSettings = document.getElementById("account-settings");

loadOverview.addEventListener("click", () => {
  $(".dashboard").load("/seller/overview.html");
});
loadManageProduct.addEventListener("click", () => {
  $(".dashboard").load("/seller/manageproducts.html");
});
loadAddProduct.addEventListener("click", () => {
  $(".dashboard").load("/seller/addproduct.html");
});
loadOrders.addEventListener("click", () => {
  $(".dashboard").load("/seller/orders.html");
});
// loadReviews.addEventListener("click", () => {
//   $(".dashboard").load("/seller/reviews.html");
// });
loadStoreSettings.addEventListener("click", () => {
  $(".dashboard").load("/seller/storesettings.html");
});
loadAccountSettings.addEventListener("click", () => {
  $(".dashboard").load("/seller/accountsettings.html");
});

// async function getSellerById(userId) {
//   // var sellerId = null;

//   // Fetch request to get the seller data based on the user ID
//   await fetch(`/api/v1/seller/${userId}`)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // Handle the data containing the seller name and ID
//       const sellerName = data.name;
//       const sellerId = data._id;
//       console.log("Seller Name:", sellerName);
//       console.log("Seller ID:", sellerId);
//       return { sellerId };
//       // Further processing with the seller name and ID, if needed
//     })
//     .catch((error) => {
//       console.error("Error fetching seller data:", error);
//       // Handle errors, show error message, etc.
//     });
// }

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  localStorage.removeItem("isAdmin");
  console.log("Logged out successfully");
  window.location.href = "/login"; // Redirect to Login
});
