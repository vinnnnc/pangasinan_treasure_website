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
  $(".dashboard").load("/admin/manageproducts.html");
});
loadAddProduct.addEventListener("click", () => {
  $(".dashboard").load("/admin/addproduct.html");
});
loadOrders.addEventListener("click", () => {
  $(".dashboard").load("/admin/orders.html");
});
loadReviews.addEventListener("click", () => {
  $(".dashboard").load("/admin/reviews.html");
});
loadStoreSettings.addEventListener("click", () => {
  $(".dashboard").load("/admin/storesettings.html");
});
loadAccountSettings.addEventListener("click", () => {
  $(".dashboard").load("/admin/accountsettings.html");
});
