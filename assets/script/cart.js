const cartContent = document.querySelector(".cart-table");

var cartItems = 1;

function setEmptyCart() {
  if (cartItems == 0) {
    document.getElementById("empty-cart").style.display = "flex";
  } else {
    document.getElementById("empty-cart").style.display = "none";
  }
}

setEmptyCart();

// Check out
const checkoutBtn = document.getElementById("checkout-btn");
const closeCheckoutBtn = document.querySelector(".close-checkout-btn");
const checkoutPanel = document.querySelector(".checkout-panel");

checkoutBtn.addEventListener("click", () => {
  hidePanel();
});

closeCheckoutBtn.addEventListener("click", () => {
  hidePanel();
});

function hidePanel() {
  checkoutPanel.classList.toggle("hide-panel");
  let allDivs = document.querySelectorAll("div:not(.checkout-panel > *)");
  allDivs.forEach((element) => {
    element.classList.toggle("disable-pointer-events");
  });
}
