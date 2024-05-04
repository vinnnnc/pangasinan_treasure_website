// Function to Create new user
function registerUser(
  fullname,
  username,
  phone,
  email,
  birthdate,
  address,
  gender,
  password
) {
  fetch("/api/v1/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullname,
      username,
      phone,
      email,
      birthdate,
      address,
      gender,
      password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("User registered successfully");
        login(username, password);
        // Optionally, redirect or perform other actions after registration
      } else {
        response.json().then((json) => {
          alert(json["message"]);
          throw new Error(json["message"]);
        });
        // throw new Error("Error registering user");
      }
    })
    .catch((error) => console.error("Error registering user:", error));
}

// Function to log in with email and password
// function login(username, password) {
//   const loginData = { username, password };

//   fetch("/api/v1/users/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(loginData),
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log("Logged in successfully");
//         // Redirect to the homepage after successful login
//         window.location.href = "/"; // Redirect to homepage
//       } else {
//         throw new Error("Error logging in");
//       }
//     })
//     .catch((error) => console.error("Error logging in:", error));
// }

async function login(username, password) {
  const loginData = { username, password };
  fetch("/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log(data.user); // Log the user email
      console.log(data.token); // Log the token
      localStorage.setItem("token", data.token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  // try {
  //   const response = await fetch("/api/v1/users/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(credentials),
  //   });
  //   const data = await response.json();

  //   console.log(data);
  //   localStorage.setItem("token", data.token);
  //   console.log("Logged in successfully");
  // } catch (error) {
  //   console.error("Error:", error);
  // }
}

// let isLoggedIn = false;

// Function to Check Login Status
// function loginStatus() {
//   return new Promise((resolve, reject) => {
//     fetch("/api/v1/auth/check", {
//       method: "GET",
//       credentials: "include", // Include credentials (cookies) in the request
//     })
//       .then((response) => {
//         if (response.ok) {
//           response.json().then((json) => {
//             console.log(json["loggedIn"]);
//             resolve(json["loggedIn"]);
//           });
//           //   isLoggedIn = true; // User is logged in
//           //   resolve(true); // Resolve the Promise with true
//         } else {
//           response.json().then((json) => {
//             console.log(json["loggedIn"]);
//             resolve(json["loggedIn"]);
//           });
//           //   resolve(false); // Resolve the Promise with false
//         }
//       })
//       .catch((error) => {
//         console.error("Error checking authentication status:", error);
//         reject(error); // Reject the Promise with the error
//       });
//   });
// }

function loginStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, user is logged in
    return true;
  } else {
    // Token does not exist, user is not logged in
    return false;
  }
}

// function refreshStatus() {
//   setTimeout(() => {
//     loginStatus(); // Call loginStatus after a short delay
//   }, 100); // Adjust the delay as needed
// }

// function logout() {
//   fetch("/api/v1/users/logout", {
//     method: "POST", // or "GET" depending on your server setup
//     credentials: "include", // Include credentials (cookies) in the request
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log("User logged out successfully");
//         window.location.href = "/login";
//         // Perform any additional actions after logout (if needed)
//       } else {
//         console.error("Failed to log out");
//         // Handle logout failure (if needed)
//       }
//     })
//     .catch((error) => {
//       console.error("Error logging out:", error);
//     });
// }

function logout() {
  localStorage.removeItem("token");
  console.log("Logged out successfully");
  window.location.href = "/login"; // Redirect to Login
}

function fetchUserProfile() {
  fetch("/users/profile", {
    method: "GET",
    credentials: "include", // Include credentials (cookies) in the request
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse JSON response
      }
      throw new Error("Error fetching user profile");
    })
    .then((data) => {
      console.log("User Profile:", data);
      // Update UI with user profile data
    })
    .catch((error) => console.error("Error fetching user profile:", error));
}

// function fetchProducts() {
//   fetch("/api/v1/products", {
//     method: "GET",
//     credentials: "include", // Include credentials (cookies) in the request
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON response
//       }
//       throw new Error("Error fetching products");
//     })
//     .then((data) => {
//       console.log("Products:", data);
//       // Update UI with product list
//     })
//     .catch((error) => console.error("Error fetching products:", error));
// }

// function fetchUserOrders() {
//   fetch("/orders", {
//     method: "GET",
//     credentials: "include", // Include credentials (cookies) in the request
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON response
//       }
//       throw new Error("Error fetching orders");
//     })
//     .then((data) => {
//       console.log("User Orders:", data);
//       // Update UI with user orders
//     })
//     .catch((error) => console.error("Error fetching orders:", error));
// }

// function fetchCartItems() {
//   fetch("/cart", {
//     method: "GET",
//     credentials: "include", // Include credentials (cookies) in the request
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON response
//       }
//       throw new Error("Error fetching cart items");
//     })
//     .then((data) => {
//       console.log("Cart Items:", data);
//       // Update UI with cart items
//     })
//     .catch((error) => console.error("Error fetching cart items:", error));
// }

// Function to fetch products and list them on the homepage
function fetchProducts() {
  fetch("/api/v1/product") // Assuming your products API endpoint is /api/v1/products
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Data contains the products array
      const productList = document.getElementById("products");

      // Clear existing product list
      productList.innerHTML = "";

      // Loop through products and create anchor elements
      data.forEach((product) => {
        const productUrl = `/product.html?id=${product._id}`;

        const productLink = document.createElement("a");
        productLink.href = productUrl;
        productLink.classList.add("product");
        productLink.href = `/product?id=${product.id}`; // Replace with actual product URL
        // Product image and sale text
        const productImage = document.createElement("div");
        productImage.classList.add("product-image");
        const image = document.createElement("img");
        image.src = "/assets/images/products/" + product.images[0]; // Replace with actual image URL
        image.alt = "product";
        productImage.appendChild(image);
        if (product.sale) {
          const saleText = document.createElement("span");
          saleText.classList.add("sale-text");
          saleText.textContent = "(sale)";
          productImage.appendChild(saleText);
        }

        // Product details
        const productDetails = document.createElement("div");
        productDetails.classList.add("product-details");
        const productName = document.createElement("span");
        productName.classList.add("product-name");
        productName.textContent = product.name;
        const priceSection = document.createElement("section");
        const productPrice = document.createElement("span");
        productPrice.classList.add("product-price");
        productPrice.textContent = `₱ ${product.variants[0].price}`;
        const ratings = document.createElement("div");
        ratings.classList.add("ratings");
        const star = document.createElement("span");
        star.classList.add("star", "checked-star");
        const productRating = document.createElement("span");
        productRating.classList.add("product-rating");
        productRating.textContent = product.averageRating;

        // Append elements to productLink
        priceSection.appendChild(productPrice);
        ratings.appendChild(star);
        priceSection.appendChild(ratings);
        ratings.appendChild(productRating);
        productDetails.appendChild(productName);
        productDetails.appendChild(priceSection);
        productLink.appendChild(productImage);
        productLink.appendChild(productDetails);

        // Append productLink to productList
        productList.appendChild(productLink);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

// Function to fetch variants for a specific product
// function fetchVariants(productId) {
//   fetch(`/api/v1/products/${productId}/variants`) // Assuming your variants API endpoint is /api/v1/products/:productId/variants
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // Data contains the variants array for the product
//       // Loop through variants and process each variant
//       data.forEach((variant) => {
//         const { userid, rating, review, date } = variant; // Destructure variant object

//         // Process userid, rating, and review as needed
//         // console.log(`User ID: ${userid}, Rating: ${rating}, Review: ${review}`);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching variants:", error);
//     });
// }

// Call fetchProducts when the page loads or as needed
// window.onload = fetchProducts;
