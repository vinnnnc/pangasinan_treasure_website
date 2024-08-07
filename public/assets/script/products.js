const addCartBtn = document.getElementById("add-cart-btn");
const addCartQuantity = document.getElementById("quantity-num");
const buyBtn = document.getElementById("buy-now-btn");
var mainImage = "";
var buyItem = {};

buyBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantity = parseInt(addCartQuantity.value, 10);
  const variantNumber = getSelectedVariant();
  console.log(
    "Adding " + productId + " x " + quantity + ", Variant: " + variantNumber
  );
  await addItemToCart(productId, quantity, variantNumber, true);
  console.log(buyItem);
  const cartItemId = findCartItemById(productId);
  // if (cartItemId) {
  //   console.log("Product ID found in cart:", cartItemId);
  //   // Now you can use the cartItemId as needed
  //   // window.location.href = `/cart?id=${cartItemId}`;
  // } else {
  //   console.error("Product ID not found in cart");
  //   // Handle the case where the product ID is not found in the cart
  // }
  window.location.href = `/cart?id=${cartItemId}`;
});

function findCartItemById(productId) {
  if (buyItem && buyItem.items && buyItem.items.length > 0) {
    const foundItem = buyItem.items.find(
      (item) => item.productId === productId
    );
    if (foundItem) {
      return foundItem._id;
    }
  }
  return null; // Return null if the product ID is not found in the cart
}

addCartBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantity = parseInt(addCartQuantity.value, 10);
  const variantNumber = getSelectedVariant();
  console.log(
    "Adding " + productId + " x " + quantity + ", Variant: " + variantNumber
  );
  addItemToCart(productId, quantity, variantNumber);
});

function getSelectedVariant() {
  const variantBtns = document.getElementById("product-view-variants").children;
  for (let i = 0; i < variantBtns.length; i++) {
    if (!variantBtns[i].classList.contains("variant-unchecked")) {
      return i;
    }
  }
  return null; // Return null if no variant is selected
}

// Function to add item to cart
async function addItemToCart(productId, quantity, variant, checkout = false) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  await fetch(`/api/v1/cart/add/${userId}/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity, variant }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Error adding item to cart");
      }
      buyItem = await response.json();
      // console.log(cart._id);
      // Item added to cart successfully
      if (!checkout) alert("Item added to cart.");
      // return cart;
      // You can redirect to the cart page or update cart UI as needed
    })
    .catch((error) => {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    });
}

function displayProductDetails() {
  // Extract product ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // Fetch product details based on the product ID
  fetch(`/api/v1/product/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((product) => {
      // Display product image
      const productViewImage = document.getElementById("product-view-image");
      productViewImage.src = `${product.images[0]}`; // Assuming images is an array
      mainImage = `${product.images[0]}`;
      // Display product gallery images
      const productViewGallery = document.querySelectorAll(".gallery-img");
      // productViewGallery.forEach((element) => {
      //   element.parentNode.style.display = "none";
      // });
      product.images.forEach((image, index) => {
        productViewGallery[index].src = `${image}`;
        productViewGallery[index].parentNode.style.opacity = "100%";
        productViewGallery[index].parentNode.style.pointerEvents = "all";
      });

      // Display product name
      const productViewName = document.getElementById("product-view-name");
      productViewName.textContent = product.name;

      // Display ratings stars
      const productStars = document.getElementById("product-view-stars");
      renderRatingStars(product.averageRating, productStars);
      // Display product rating

      const productViewRating = document.createElement("span");
      productViewRating.classList.add("product-rating");
      productViewRating.id = "product-view-rating";
      productStars.appendChild(productViewRating);
      const rating = product.averageRating; // Get average rating from productDetails
      const ratingsCount = product.ratings.length; // Get ratings count
      productViewRating.textContent = `${rating.toFixed(
        1
      )} (${ratingsCount}) | ${product.totalSold} Sold`;

      // Display product price
      const productViewPrice = document.getElementById("product-view-price");
      productViewPrice.textContent = `₱ ${product.variants[0].price.toFixed(
        2
      )}`; // Assuming price is from the first variant

      // Display sale text if applicable
      const productViewSaleText = document.querySelector(
        ".product-view-sale-text"
      );
      if (product.variants[0].sale) {
        productViewSaleText.textContent = product.variants[0].sale;
      } else {
        productViewSaleText.style.display = "none"; // Hide sale text if not applicable
      }

      // Display product variants as buttons
      const productViewVariants = document.getElementById(
        "product-view-variants"
      );
      productViewVariants.innerHTML = "";
      product.variants.forEach((variant, index) => {
        const button = document.createElement("button");
        if (index == 0) button.className = "product-view-btn variant-btn";
        else
          button.className = "product-view-btn variant-btn variant-unchecked";
        button.textContent = index + 1;
        button.id = `variant-btn-${variant._id}`; // Assuming each variant has an _id
        productViewVariants.appendChild(button);

        // Add click event listener to variant buttons
        button.addEventListener("click", () => {
          productViewQuantity.value = 1;

          const variantName = document.getElementById("variant-name");
          variantName.textContent = product.variants[index].variantName;
          const variantStock = document.getElementById("product-view-stock");
          variantStock.textContent = product.variants[index].stockCount;
          // Update variant button styles
          const variantButtons = document.querySelectorAll(".variant-btn");
          productViewPrice.textContent = `₱ ${product.variants[
            index
          ].price.toFixed(2)}`;
          productViewImage.src = `${product.variants[index].image}`;
          productViewGallery[0].src = `${product.variants[index].image}`;
          mainImage = productViewImage.src;
          variantButtons.forEach((btn) =>
            btn.classList.add("variant-unchecked")
          );
          button.classList.remove("variant-unchecked");
        });
      });

      // Display stock count of the selected variant
      const productViewStock = document.getElementById("product-view-stock");
      productViewStock.textContent = product.variants[0].stockCount; // Assuming stock count is from the first variant

      // Display variant name
      const variantName = document.getElementById("variant-name");
      variantName.textContent = product.variants[0].variantName; // Assuming variant name is from the first variant

      // Display product details
      const productDetails = document.querySelector(
        ".product-details-container"
      );
      productDetails.textContent = product.description;

      // Display Ratings

      if (product.ratings.length > 0) {
        product.ratings.forEach((review, index) => {
          // console.log(review);
          const reviewImg = document.createElement("div");
          reviewImg.classList.add("review-img");
          const img = document.createElement("img");
          const userName = document.createElement("span");
          const profileSection = document.createElement("section");
          const reviewContainer = document.querySelector(".review-container");
          // Clear previous reviews if any
          reviewContainer.innerHTML = "";

          const reviewElement = document.createElement("div");
          reviewElement.classList.add("review");
          profileSection.classList.add("review-profile-section");

          fetch(`/api/v1/users/list/${review.userId}`) // Replace with your actual API endpoint
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch user details");
              }
              return response.json();
            })
            .then((userData) => {
              // Process the user data and update UI
              const { username, avatar } = userData;
              img.src = avatar;
              userName.textContent = username; // Assuming name is available in the user data
            })
            .catch((error) => {
              console.error("Error fetching user details:", error);
            });

          img.alt = "user";
          reviewImg.appendChild(img);

          profileSection.appendChild(reviewImg);
          profileSection.appendChild(userName);

          // Create elements for rating section
          const ratingSection = document.createElement("section");
          ratingSection.classList.add("review-rating-section");

          const ratings = document.createElement("div");
          ratings.classList.add("ratings");
          ratings.id = "ratings-star";

          renderRatingStars(review.rating, ratings);
          const productRating = document.createElement("span");
          productRating.classList.add("product-rating");
          productRating.textContent = review.rating.toFixed(1);

          const reviewText = document.createElement("p");
          reviewText.textContent = review.review;

          ratingSection.appendChild(ratings);
          ratings.appendChild(productRating);
          ratingSection.appendChild(reviewText);

          // Append profile and rating sections to review element
          reviewElement.appendChild(profileSection);
          reviewElement.appendChild(ratingSection);

          // Append review element to reviews container
          reviewContainer.appendChild(reviewElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
    });
}

const renderRatingStars = (rating, container) => {
  // const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous stars

  const maxRating = 5; // Maximum rating value (number of stars)
  const roundedRating = Math.round(rating * 2) / 2; // Round rating to nearest half

  for (let i = 0; i < maxRating; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.classList.add("unchecked-star");

    // Add "checked-star" class for filled stars based on rounded rating
    if (i + 0.5 <= roundedRating) {
      star.classList.remove("unchecked-star");
    }

    container.appendChild(star);
  }
};
// window.onload = displayProductDetails;

window.addEventListener("load", myInit, true);

function myInit() {
  fetchProducts();
  displayProductDetails();
}
