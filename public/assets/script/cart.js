const cartContent = document.querySelector(".cart-table");
const subtotal1Text = document.getElementById("summary-subtotal1");
const shippingfeeText = document.getElementById("summary-shippingfee");
const subtotal2Text = document.getElementById("summary-subtotal2");
// Check out
const checkoutBtn = document.getElementById("checkout-btn");
const closeCheckoutBtn = document.querySelector(".close-checkout-btn");
const checkoutPanel = document.querySelector(".checkout-panel");
const checkAll = document.getElementById("cart-select-all");
const checkedItems = [];
const checkedShops = {};

// checkAll.addEventListener("change", () => {
//   checkboxes = document.getElementsByClassName("checkbox");
//   for (var i = 0, n = checkboxes.length; i < n; i++) {
//     checkboxes[i].checked = checkAll.checked;
//   }
// });

checkoutBtn.addEventListener("click", () => {
  const checkoutSubtotal1 = document.getElementById("checkout-subtotal-1");
  const checkoutSubtotal2 = document.getElementById("checkout-subtotal-2");
  const checkoutShippingFee = document.getElementById("checkout-shipping-fee");
  checkoutSubtotal1.innerText = subtotal1Text.innerText;
  checkoutSubtotal2.innerText = subtotal2Text.innerText;
  checkoutShippingFee.innerText = shippingfeeText.innerText;
  console.log();
  hidePanel();
  // let totalPrice = 0;

  // checkedItems.forEach((item) => {
  //   totalPrice += item.productId.variants[item.variant].price * item.quantity;
  //   totalPrice += 40;
  // });
  // console.log(totalPrice);
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

    cartItems.sort((a, b) =>
      a.productId.seller.localeCompare(b.productId.seller)
    );

    // Display cart items in the cart table
    const cartTableBody = document.getElementById("cart-table-body");

    // let currentShop = "";
    // let shopRowAdded = false;

    cartTableBody.innerHTML = ``; // Clear previous cart items
    var subtotal1 = 0;
    var shippingfee = 50;
    var subtotal2 = 0;

    cartItems.forEach(async (cartItem) => {
      // currentShop = cartItem.productId.seller;
      // shopRowAdded = false;

      // if (!shopRowAdded) {
      //   const currentShopName = await fetch(
      //     `/api/v1/seller/${cartItem.productId.seller}`
      //   )
      //     .then((response) => {
      //       if (!response.ok) {
      //         throw new Error(`HTTP error! Status: ${response.status}`);
      //       }
      //       return response.json();
      //     })
      //     .then((data) => {
      //       // Assuming the response contains a field named "name" for the seller's name
      //       const sellerName = data.name;
      //       console.log("Seller Name:", sellerName);
      //       return sellerName;
      //       // Further processing with the seller's name, if needed
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching seller name:", error);
      //       // Handle errors, show error message, etc.
      //     });

      //   // Add a row for the shop name
      //   const shopRow = document.createElement("tr");
      //   const shopNameCell = document.createElement("td");
      //   const shopNameText = document.createElement("span");
      //   const shopIcon = document.createElement("img");
      //   shopIcon.src = "/assets/images/icons/store-solid.svg";
      //   shopIcon.classList.add("shop-icon");
      //   shopNameText.textContent = currentShopName;
      //   shopNameCell.colSpan = 7; // Set the colspan to span all columns
      //   shopNameCell.classList.add("shop-name-cell");
      //   shopRow.classList.add("cart-shop-row");
      //   shopRow.appendChild(shopNameCell);
      //   cartTableBody.appendChild(shopRow);
      //   shopNameCell.appendChild(shopIcon);
      //   shopNameCell.appendChild(shopNameText);
      // }

      const cartTableRow = document.createElement("tr");
      subtotal1 +=
        cartItem.productId.variants[cartItem.variant].price * cartItem.quantity;
      subtotal2 = subtotal1 + shippingfee;
      cartTableRow.innerHTML = `
        <th>
          <input type="checkbox" id="cart-product-${
            cartItem._id
          }" value="checked-${cartItem._id}"/>
        </th>
        <th>
            <img src="${cartItem.productId.images[0]}" alt="${
        cartItem.productId.name
      }">
        </th>
        <th>
          <div class="product-text">
            ${cartItem.productId.name}
          </div>
        <span class="variant-text">Variant: 
          <div class="variant"">
            ${cartItem.productId.variants[cartItem.variant].variantName}
          </div>
        </span>
        </th>
        <th>₱ ${cartItem.productId.variants[cartItem.variant].price.toFixed(
          2
        )}</th>
        <th>
          <div class="cart-quantity">
            <button class="cart-quantity-btn" id="cart-quantity-subtract-btn-${
              cartItem._id
            }" aria-label="Decrease">&minus;</button>
            <input class="cart-product-quantity" type="text"  role="spinbutton" value="${parseInt(
              cartItem.quantity,
              10
            )}" id="cart-item-quantity-${cartItem._id}"/>
            <button class="cart-quantity-btn" id="cart-quantity-add-btn-${
              cartItem._id
            }" aria-label="Increase">&plus;</button>
          </div>
        </th>
        <th>₱ ${(
          cartItem.productId.variants[cartItem.variant].price.toFixed(2) *
          cartItem.quantity
        ).toFixed(2)}</th>
        <th>
          <a href="#" title="Delete" class="delete-cart" id="cart-delete-btn-${
            cartItem._id
          }">
            <img src="/assets/images/delete.svg" />
          </a>
        </th>
      `;
      cartTableBody.appendChild(cartTableRow);
      const checkbox = document.getElementById(`cart-product-${cartItem._id}`);
      checkbox.classList.add("checkbox");
      const quantitybtn = document.getElementById(
        `cart-item-quantity-${cartItem._id}`
      );
      const subtractbtn = document.getElementById(
        `cart-quantity-subtract-btn-${cartItem._id}`
      );
      const addbtn = document.getElementById(
        `cart-quantity-add-btn-${cartItem._id}`
      );
      const deletebtn = document.getElementById(
        `cart-delete-btn-${cartItem._id}`
      );

      // Object to keep track of shops with checked items and their corresponding subtotals

      checkbox.addEventListener("change", () => {
        const checkedItem = cartItems.find((item) => cartItem._id === item._id);
        const productPrice = parseFloat(
          checkedItem.productId.variants[checkedItem.variant].price.toFixed(2)
        );
        const shopName = checkedItem.productId.seller; // Assuming shop name is stored in 'seller' field
        // const subtotal1 = parseFloat(subtotal1Text.innerText.replace("₱ ", ""));
        // let subtotal2 = parseFloat(subtotal2Text.innerText.replace("₱ ", ""));

        if (checkbox.checked) {
          //   const tempSub1 = subtotal1 + productPrice * checkedItem.quantity;
          //   const tempSub2 = subtotal2 + productPrice * checkedItem.quantity + 40;
          //   subtotal1Text.innerText = `₱ ${tempSub1.toFixed(2)}`;
          //   subtotal2Text.innerText = `₱ ${tempSub2.toFixed(2)}`;
          checkedItems.push(cartItem);
          //   // // Increment subtotal2 for the shop
          //   // checkedShops[shopName] = (checkedShops[shopName] || 0) + 40;
          //   // Object.keys(checkedShops).forEach((shop) => {
          //   //   subtotal2 += checkedShops[shop];
          //   // });
        } else {
          //   const tempSub1 = subtotal1 - productPrice * checkedItem.quantity;
          //   const tempSub2 = subtotal2 - productPrice * checkedItem.quantity - 40;
          //   subtotal1Text.innerText = `₱ ${tempSub1.toFixed(2)}`;
          //   subtotal2Text.innerText = `₱ ${tempSub2.toFixed(2)}`;
          const index = checkedItems.indexOf(checkbox);
          checkedItems.splice(index, 1);
          // // Decrement subtotal2 for the shop
          // checkedShops[shopName] = (checkedShops[shopName] || 0) - 40;
          // Object.keys(checkedShops).forEach((shop) => {
          //   subtotal2 += checkedShops[shop];
          // });
        }
        updateSummary();

        // if (checkedItems.length > 0) {
        //   let totalShipping = 40 * checkedItems.length;
        //   shippingfeeText.innerText = `₱ ${totalShipping.toFixed(2)}`;
        //   checkoutBtn.classList.remove("disabled");
        // } else {
        //   shippingfeeText.innerText = "₱ 0.00";
        //   checkoutBtn.classList.add("disabled");
        // }
        console.log(checkedItems);
      });

      addbtn.addEventListener("click", () => {
        if (quantitybtn.value < cartItem.productId.maxOrder) {
          updateCartQuantity(cartItem._id, parseInt(quantitybtn.value, 10) + 1);
          // quantitybtn.value = parseInt(quantitybtn.value, 10) + 1;
        } else alert("Maximum order quantity reached!");
      });
      subtractbtn.addEventListener("click", () => {
        if (quantitybtn.value > 1) {
          updateCartQuantity(cartItem._id, quantitybtn.value - 1);
          // quantitybtn.value -= 1;
        } else {
          deleteCartItem(cartItem._id);
        }
      });
      deletebtn.addEventListener("click", () => {
        deleteCartItem(cartItem._id);
      });
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

async function deleteCartItem(itemId, withConfirm = true) {
  if (withConfirm) {
    if (confirm("Delete item?") == false) {
      return;
    }
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
    if (withConfirm) await fetchCartItems();
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
    checkedItems.length = 0;
    updateSummary();
    // Optionally, you can update the UI with the updated cart data
    return true;
  } catch (error) {
    console.error("Error modifying item quantity:", error.message);
    return false;
  }
}

async function fetchUserProfile() {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`/api/v1/users/list/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return null; // Or handle the error as needed
  }
}

var defaultShippingAddress = "";

async function getAddressBook() {
  const addressBookContainer = document.querySelector(
    ".shipping-address-container"
  );
  addressBookContainer.innerHTML = ""; // Clear previous content

  const user = await fetchUserProfile();
  console.log(user.addressbook);

  addressBookContainer.innerHTML = `
    <span class="panel-title">Shipping address</span>
    <span>${user.addressbook[0].name}</span>
    <span>${user.addressbook[0].phone}</span>
    <span>${user.addressbook[0].address}</span>
    <button class="edit-address-btn">Edit</button
  `;
  defaultShippingAddress = user.addressbook[0].address;

  // user.addressbook.forEach((addressData) => {
  //   const addressCardHTML = createAddressCardHTML(addressData);
  //   addressBookContainer.insertAdjacentHTML("beforeend", addressCardHTML);
  // });
  // addressBookContainer.insertAdjacentHTML(
  //   "beforeend",
  //   `<button type="button" id="add-new-address">
  //     &plus; Add New Address
  //   </button>`
  // );
}
getAddressBook();
// Call fetchCartItems function to fetch and display cart items
window.onload = fetchCartItems();

const placeOrder = async (orderData) => {
  try {
    const response = await fetch("/api/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Order placed successfully:", data);
    // Further processing if needed
    return data; // Return the order data or any relevant response
  } catch (error) {
    console.error("Error placing order:", error);
    // Handle errors, show error message, etc.
    throw error; // Throw the error for handling in the calling function
  }
};
// const orderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: { type: Number, default: 1 },
// });

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   orderItems: [orderItemSchema],
//   shippingAddress: { type: String, required: true },
//   paymentMethod: { type: String, required: true },
//   status: { type: String, default: "Pending" },
//   totalPrice: { type: Number, required: true },
//   dateOrdered: { type: Date, default: Date.now },
// });

function getPrice() {
  const userId = localStorage.getItem("userId");
  let totalPrice1 = 0;
  let totalPrice2 = 0;
  checkedItems.forEach((item) => {
    totalPrice1 += item.productId.variants[item.variant].price * item.quantity;
    totalPrice2 += 40;
  });

  return {
    subtotal1: totalPrice1,
    subtotal2: totalPrice1 + totalPrice2,
  };
}

function updateSummary() {
  // const
  const subtotal1Text = document.getElementById("summary-subtotal1");
  const shippingfeeText = document.getElementById("summary-shippingfee");
  const subtotal2Text = document.getElementById("summary-subtotal2");
  subtotal1Text.innerText = `₱ ${getPrice().subtotal1.toFixed(2)}`;
  shippingfeeText.innerText = `₱ ${(40 * checkedItems.length).toFixed(2)}`;
  subtotal2Text.innerText = `₱ ${getPrice().subtotal2.toFixed(2)}`;
  if (checkedItems.length > 0) {
    checkoutBtn.classList.remove("disabled");
  } else {
    checkoutBtn.classList.add("disabled");
  }
}

function getOrderDetails() {
  const userId = localStorage.getItem("userId");
  // let totalPrice = 0;

  // checkedItems.forEach((item) => {
  //   totalPrice += item.productId.variants[item.variant].price * item.quantity;
  //   totalPrice += 40;
  // });

  const orderData = {
    userId,
    orderItems: checkedItems,
    shippingAddress: defaultShippingAddress,
    paymentMethod: "COD",
    totalPrice: getPrice().subtotal2.toFixed(2), // Total price of the order
    // Other order-related data
  };
  return orderData;
}
const successPanel = document.querySelector(".order-success-panel");
const successCloseBtn = document.querySelector(".close-order-success-btn");
const placeOrderBtn = document.getElementById("place-order-btn");
placeOrderBtn.addEventListener("click", async () => {
  await placeOrder(getOrderDetails())
    .then(async (order) => {
      console.log(checkedItems);
      // Handle the returned order data
      // console.log("Order placed successfully:", order);
      // await Promise.all(
      //   checkedItems.map(async (item) => {
      //     console.log("Deleting " + item._id);
      //     await deleteCartItem(item._id, false);
      //   })
      // );
      for (i = 0; i < checkedItems.length; i++) {
        console.log("Deleting " + checkedItems[i]._id);
        await deleteCartItem(checkedItems[i]._id, false);
      }
      // checkedItems.length = 0;
      await fetchCartItems();
      hidePanel();
      successPanel.classList.remove("hide");
      // Perform actions based on the order, such as updating UI, etc.
    })
    .catch((error) => {
      // Handle the error
      console.error("Error placing order:", error);
      // Show error message to the user or handle as needed
    });
});

successCloseBtn.addEventListener("click", () => {
  successPanel.classList.add("hide");
});
