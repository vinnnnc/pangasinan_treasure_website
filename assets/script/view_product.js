class ProductVariant {
  static totalVariants = 0;
  constructor(id, name, price, stockCount) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stockCount = stockCount;
    ProductVariant.totalVariants++;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPrice() {
    return this.price;
  }

  getStockCount() {
    return this.stockCount;
  }

  getVariantCount() {
    return ProductVariant.totalVariants;
  }

  setStockCount(newStockCount) {
    this.stockCount = newStockCount;
  }
}

// Buttons
const addQuantityBtn = document.getElementById("quantity-add-btn");
const subtractQuantityBtn = document.getElementById("quantity-subtract-btn");
const buyNowBtn = document.getElementById("buy-now-btn");
const addCartBtn = document.getElementById("add-cart-btn");
const visitShopBtn = document.getElementById("visit-shop-btn");
const chatShopBtn = document.getElementById("chat-shop-btn");

// Product View Details
const productViewName = document.getElementById("product-view-name");
const productViewPrice = document.getElementById("product-view-price");
const productViewRating = document.getElementById("product-view-rating");
const productViewVariants = document.getElementById("product-view-variants");
const productViewVariantName = document.getElementById("variant-name");
const productViewStock = document.getElementById("product-view-stock");
const productViewQuantity = document.getElementById("quantity-num");
const productViewShop = document.getElementById("shop-name");

// Store values
var productName = "Boneless Bangus V2";
var productPrice = 150.99;
var productRating = 3;
// var productStock = 10;
var productQuantity = 1;
var productShop = "Juan's Shop V2";
var maxQuantity = 50;
var productVariants = [];
var productStock = "";

// ------------API-------------
function addVariant(id, name, price, stock) {
  let variant = new ProductVariant(id, name, price, stock);
  productVariants.push(variant);
}
addVariant("variant001", "Boneless Bangus", 150.5, 10);
addVariant("variant001", "Bangus V2", 192.5, 5);
// ----------------------------

productViewName.innerHTML = productName;
productViewPrice.innerHTML = productPrice;
productViewRating.innerHTML = productRating;
// productViewVariants.innerHTML = totalVariants;
productViewStock.innerHTML = productStock;
// productViewQuantity.innerHTML = productQuantity;
productViewShop.innerHTML = productShop;

function addVariantButton(variantId, checked, index) {
  const button = document.createElement("button");
  if (checked) button.className = "product-view-btn variant-btn";
  else button.className = "product-view-btn variant-btn variant-unchecked";
  button.id = `variant-btn-${variantId}`;
  button.textContent = index;
  productViewVariants.appendChild(button);
}

productVariants.forEach((element, index) => {
  let checked = true;
  if (index == 0) checked = true;
  else checked = false;
  addVariantButton(element.getId(), checked, index + 1);
});

const variantButtons = document.getElementsByClassName("variant-btn");

// set first variant
productViewStock.innerText = `${productVariants[0].getStockCount()} left`;
productViewPrice.innerText = `₱ ${productVariants[0].getPrice()}`;

for (let i = 0; i < variantButtons.length; i++) {
  variantButtons[i].addEventListener("click", () => {
    for (let i = 0; i < variantButtons.length; i++) {
      variantButtons[i].classList.add("variant-unchecked");
    }
    variantButtons[i].classList.remove("variant-unchecked");
    productViewVariantName.innerText = productVariants[i].getName();
    productViewStock.innerText = `${productVariants[i].getStockCount()} left`;
    productViewPrice.innerText = `₱ ${productVariants[i].getPrice()}`;
    productViewQuantity.value = 1;
  });
}

// element.addEventListener("click", () => {
//   console.log(`Clicked variant button ${variantName}`);
//   variantButtons.forEach((index) => {
//     variantButtons[index].classList.add("variant-unchecked");
//   });
//   element.classList.remove("variant-unchecked");
// });

function setQuantity(num) {
  productViewQuantity.value = num;
}

function addQuantity() {
  productQuantity++;
  if (productQuantity > maxQuantity) productQuantity = maxQuantity;
  setQuantity(productQuantity);
}

function subtractQuantity() {
  productQuantity--;
  if (productQuantity < 1) productQuantity = 1;
  setQuantity(productQuantity);
}

addQuantityBtn.addEventListener("click", () => {
  addQuantity();
});

subtractQuantityBtn.addEventListener("click", () => {
  subtractQuantity();
});

productViewQuantity.addEventListener("focusout", () => {
  productQuantity = productViewQuantity.value;
  setQuantity(productQuantity);
});
