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
