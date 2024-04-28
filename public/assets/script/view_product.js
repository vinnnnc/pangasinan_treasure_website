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

class Product {
  static ratingCount = 0;
  static ratingAverage = 0;
  static ratingSum = 0;
  constructor(id, name, rating = [], sold, variant, shop) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.sold = sold;
    this.variant = variant;
    this.shop = shop;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getRating() {
    return this.rating;
  }
  getSold() {
    return this.sold;
  }
  getVariant() {
    return this.variant;
  }
  getShop() {
    return this.shop;
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
addVariant("variant001", "Class A", 299.99, 100);
addVariant("variant001", "Class B", 190.0, 50);
addVariant("variant001", "Class C", 150.0, 120);
// ----------------------------

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
setProductView(productName, productRating, productShop, productVariants[0]);
function setProductView(name, rating, shop, variant) {
  productViewName.innerHTML = name;
  productViewRating.innerHTML = rating;
  productViewShop.innerHTML = shop;
  productViewPrice.innerHTML = `₱ ${variant.getPrice().toFixed(2)}`;
  productViewVariantName.innerHTML = variant.getName();
  productViewStock.innerHTML = `${variant.getStockCount()} left`;
}

for (let i = 0; i < variantButtons.length; i++) {
  variantButtons[i].addEventListener("click", () => {
    for (let i = 0; i < variantButtons.length; i++) {
      variantButtons[i].classList.add("variant-unchecked");
    }
    variantButtons[i].classList.remove("variant-unchecked");
    // productViewVariantName.innerText = productVariants[i].getName();
    // productViewStock.innerText = `${productVariants[i].getStockCount()} left`;
    // productViewPrice.innerText = `₱ ${productVariants[i]
    //   .getPrice()
    //   .toFixed(2)}`;
    setProductView(productName, productRating, productShop, productVariants[i]);
    productViewQuantity.value = 1;
  });
}

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

// Product Gallery
const productGalleryImages = document.querySelectorAll(".gallery-img");
const productImage = document.getElementById("product-view-image");
let mainImage = productImage.src;

productGalleryImages.forEach((element) => {
  element.addEventListener("mouseover", () => {
    productImage.src = element.src;
    console.log(element.firstChild);
  });
  element.addEventListener("mouseout", () => {
    productImage.src = mainImage;
    console.log(element.firstChild);
  });
  element.addEventListener("click", () => {
    productImage.src = element.src;
    mainImage = element.src;
    productGalleryImages.forEach((element) => {
      element.parentElement.classList.remove("gallery-active");
    });
    element.parentElement.classList.add("gallery-active");
    console.log(element.firstChild);
  });
});
