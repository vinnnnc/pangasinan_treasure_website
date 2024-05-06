const cartContent = document.querySelector(".cart-table");
const subtotal1Text = document.getElementById("summary-subtotal1");
const shippingfeeText = document.getElementById("summary-shippingfee");
const subtotal2Text = document.getElementById("summary-subtotal2");
// Check out
const checkoutBtn = document.getElementById("checkout-btn");
const closeCheckoutBtn = document.querySelector(".close-checkout-btn");
const checkoutPanel = document.querySelector(".checkout-panel");
const checkedItems = [];
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
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!userId) {
    console.error("User ID is required.");
    return;
  }

  const requestBody = JSON.stringify({ userId });
  try {
    const response = await fetch("/api/v1/cart", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const cart = await response.json();
    const cartItems = cart.items; // Array of cart items
    if (cartItems.length > 0) {
      document.getElementById("empty-cart").style.display = "none";
    } else {
      document.getElementById("empty-cart").style.display = "flex";
      shippingfeeText.innerText = "₱ 0.00";
    }
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
          <input type="checkbox" id="cart-product-${
            item.productId._id
          }" value="checked-${item.productId._id}"/>
        </th>
        <th>
            <img src="${item.productId.images[0]}" alt="${item.productId.name}">
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
            <button class="cart-quantity-btn" id="cart-quantity-subtract-btn-${
              item.productId._id
            }" aria-label="Decrease">&minus;</button>
            <input class="cart-product-quantity" type="text"  role="spinbutton" value="${parseInt(
              item.quantity,
              10
            )}" id="cart-item-quantity-${item.productId._id}"/>
            <button class="cart-quantity-btn" id="cart-quantity-add-btn-${
              item.productId._id
            }" aria-label="Increase">&plus;</button>
          </div>
        </th>
        <th>₱ ${(
          item.productId.variants[item.variant].price.toFixed(2) * item.quantity
        ).toFixed(2)}</th>
        <th>
          <a href="#" title="Delete" class="delete-cart" id="cart-delete-btn-${
            item.productId._id
          }">
            <img src="/assets/images/delete.svg" />
          </a>
        </th>
      `;
      cartTableBody.appendChild(cartTableRow);
      const checkbox = document.getElementById(
        `cart-product-${item.productId._id}`
      );
      const quantitybtn = document.getElementById(
        `cart-item-quantity-${item.productId._id}`
      );
      const subtractbtn = document.getElementById(
        `cart-quantity-subtract-btn-${item.productId._id}`
      );
      const addbtn = document.getElementById(
        `cart-quantity-add-btn-${item.productId._id}`
      );
      const deletebtn = document.getElementById(
        `cart-delete-btn-${item.productId._id}`
      );

      checkbox.addEventListener("change", () => {
        const sum1 = parseFloat(subtotal1Text.innerText.replace("₱", ""));
        const sum2 = parseFloat(subtotal2Text.innerText.replace("₱", ""));

        if (checkbox.checked) {
          const tempSub1 = sum1 + subtotal1;
          const tempSub2 = sum2 + subtotal2;
          subtotal1Text.innerText = `₱${tempSub1.toFixed(2)}`;
          subtotal2Text.innerText = `₱${tempSub2.toFixed(2)}`;
          checkedItems.push(checkbox);
        } else {
          const tempSub1 = subtotal1 - subtotal1;
          const tempSub2 = subtotal2 - subtotal2;
          subtotal1Text.innerText = `₱${tempSub1.toFixed(2)}`;
          subtotal2Text.innerText = `₱${tempSub2.toFixed(2)}`;
          const index = checkedItems.indexOf(checkbox);
          checkedItems.splice(index, 1);
        }
        if (checkedItems.length > 0) {
          shippingfeeText.innerText = "₱ 40.00";
          checkoutBtn.classList.remove("disabled");
        } else {
          shippingfeeText.innerText = "₱ 0.00";
          checkoutBtn.classList.add("disabled");
        }
        console.log(checkedItems);
      });

      addbtn.addEventListener("click", () => {
        if (quantitybtn.value < item.productId.maxOrder) {
          updateCartQuantity(
            item.productId,
            parseInt(quantitybtn.value, 10) + 1
          );
          // quantitybtn.value = parseInt(quantitybtn.value, 10) + 1;
        } else alert("Maximum order quantity reached!");
      });
      subtractbtn.addEventListener("click", () => {
        if (quantitybtn.value > 1) {
          updateCartQuantity(item.productId, quantitybtn.value - 1);
          // quantitybtn.value -= 1;
        } else {
          deleteCartItem(item._id);
        }
      });
      deletebtn.addEventListener("click", () => {
        deleteCartItem(item._id);
      });
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

async function deleteCartItem(itemId) {
  let text;
  if (confirm("Delete item?") == false) {
    return;
  }
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  if (!userId || !itemId) {
    console.error("userId and itemId are required.");
    return;
  }
  // const requestBody = JSON.stringify({ itemId, userId });
  try {
    const response = await fetch(`/api/v1/cart/remove/${userId}/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Item deleted successfully:", data.message);
    // console.log("Updated cart:", data.cart);
    // Optionally, you can update the UI with the updated cart data
    await fetchCartItems();
  } catch (error) {
    console.error("Error deleting item:", error.message);
  }
}

async function updateCartQuantity(itemId, newQuantity) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !itemId || !newQuantity) {
    console.error("userId, itemId, and newQuantity are required.");
    return;
  }

  const requestBody = JSON.stringify({ userId, itemId, newQuantity });

  try {
    const response = await fetch("/api/v1/cart/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Item quantity updated successfully:", data.message);
    console.log("Updated cart:", data.cart);
    await fetchCartItems();
    // Optionally, you can update the UI with the updated cart data
    return true;
  } catch (error) {
    console.error("Error modifying item quantity:", error.message);
    return false;
  }
}

// Call fetchCartItems function to fetch and display cart items
window.onload = fetchCartItems();
