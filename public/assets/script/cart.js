const cartContent = document.querySelector(".cart-table");
const subtotal1Text = document.getElementById("summary-subtotal1");
const shippingfeeText = document.getElementById("summary-shippingfee");
const subtotal2Text = document.getElementById("summary-subtotal2");

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

// Function to fetch cart items
const fetchCartItems = async () => {
  try {
    const response = await fetch("/api/v1/cart/"); // Replace with your actual API endpoint for fetching cart items
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const cart = await response.json();
    const cartItems = cart.items; // Array of cart items
    console.log(cartItems);

    // Display cart items in the cart table
    const cartTableBody = document.getElementById("cart-table-body");
    cartTableBody.innerHTML = `
              <tr>
              <th><input type="checkbox" id="cart-product-1" /></th>
              <th></th>
              <th></th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>`; // Clear previous cart items
    var subtotal1 = 0;
    var shippingfee = 50;
    var subtotal2 = 0;

    cartItems.forEach((item) => {
      const cartTableRow = document.createElement("tr");
      subtotal1 += item.productId.variants[item.variant].price * item.quantity;
      subtotal2 = subtotal1 + shippingfee;
      cartTableRow.innerHTML = `
        <th>
          <input type="checkbox" id="cart-product-${item.productId._id}" />
        </th>
        <th>
            <img src="/assets/images/products/${
              item.productId.images[0]
            }" alt="${item.productId.name}">
        </th>
        <th>
          <div class="product-text">
            ${item.productId.name}
          </div>
          <select name="variant" class="variant" data-product-id="${item._id}">
            ${item.productId.variants
              .map(
                (variant, index) => `
              <option value="${variant.variantName}" ${
                  index === item.variant ? "selected" : ""
                }>${variant.variantName}</option>
            `
              )
              .join("")}
          </select>
        </th>
        <th>₱ ${item.productId.variants[item.variant].price.toFixed(2)}</th>
        <th>
          <div class="cart-quantity">
            <button class="cart-quantity-btn" id="cart-quantity-subtract-btn" aria-label="Decrease">&minus;</button>
            <input class="cart-product-quantity" type="text" aria-valuenow="${
              item.quantity
            }" role="spinbutton" value="${item.quantity}" />
            <button class="cart-quantity-btn" id="cart-quantity-add-btn" aria-label="Increase">&plus;</button>
          </div>
        </th>
        <th>₱ ${(
          item.productId.variants[item.variant].price.toFixed(2) * item.quantity
        ).toFixed(2)}</th>
        <th>
          <a href="#" title="Delete" class="delete-cart" data-product-id="${
            item._id
          }">
            <img src="/assets/images/delete.svg" />
          </a>
        </th>
      `;

      cartTableBody.appendChild(cartTableRow);
    });
    subtotal1Text.innerText = subtotal1.toFixed(2);
    subtotal2Text.innerText = subtotal2.toFixed(2);
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

// Call fetchCartItems function to fetch and display cart items
window.onload = fetchCartItems();
