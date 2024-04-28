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
const loadManageProduct = document.getElementById("manage-products");
const loadAddProduct = document.getElementById("add-product");
const loadOrders = document.getElementById("orders");
const loadReviews = document.getElementById("reviews");
const loadStoreSettings = document.getElementById("store-settings");
const loadAccountSettings = document.getElementById("account-settings");

loadManageProduct.addEventListener("click", () => {
  $(".dashboard").load("/seller/manageproducts.html");
});
loadAddProduct.addEventListener("click", () => {
  $(".dashboard").load("/seller/addproduct.html");
});
loadOrders.addEventListener("click", () => {
  $(".dashboard").load("/seller/orders.html");
});
loadReviews.addEventListener("click", () => {
  $(".dashboard").load("/seller/reviews.html");
});
loadStoreSettings.addEventListener("click", () => {
  $(".dashboard").load("/seller/storesettings.html");
});
loadAccountSettings.addEventListener("click", () => {
  $(".dashboard").load("/seller/accountsettings.html");
});
