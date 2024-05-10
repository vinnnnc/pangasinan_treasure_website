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

async function accessCartPage() {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  if (token) {
    try {
      const response = await fetch("/cartAuth", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json", // Set the appropriate content type if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // const cartData = await response.json();
      // console.log("Cart Data:", cartData);
      window.location.href = "/cart";
    } catch (error) {
      console.error("Error accessing cart page:", error.message);
    }
  } else {
    console.log("User is not logged in, token is null or undefined.");
    window.location.href = "/login";
    // Handle the case where the user is not logged in
  }
}

// Function to log in with email and password
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
      localStorage.setItem("userId", data.userId);
      if (!data.token) {
        alert("Wrong Username or Password!");
        return;
      }
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loginStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
}

function logout() {
  localStorage.removeItem("userId");
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
      createProductCards(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

function createProductCards(data) {
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
    image.src = product.images[0]; // Replace with actual image URL
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
    productPrice.textContent = `₱ ${product.variants[0].price.toFixed(2)}`;
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
}
