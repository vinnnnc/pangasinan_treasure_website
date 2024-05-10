// const filterCategory = document.getElementById("filter-category");

// const filterMinPrice = document.getElementById("filter-minprice");
// const filterMaxPrice = document.getElementById("filter-maxprice");
// const filterSortBy = document.getElementById("filter-sort");
// const filterRating = document.getElementById("filter-rating");
// const setFilter = document.getElementById("set-filter-btn");
// const resetFilter = document.getElementById("reset-filter-btn");
const resultText = document.getElementById("result-text");

// Assuming you have a form with input fields for category, shippedFrom, minPrice, maxPrice, and sortBy
const form = document.getElementById("filter-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form submission

  const formData = new FormData(form);
  const queryParams = new URLSearchParams(formData).toString();

  try {
    const response = await fetch(`/api/v1/product/search?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    createProductCards(data);
  } catch (error) {
    console.error("Error:", error.message);
    // Handle error (e.g., display error message)
  }
});

// Fetch products from the server
// async function searchProducts(productName) {
//   try {
//     const response = await fetch(
//       `/search?productName=${encodeURIComponent(productName)}`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const products = await response.json();
//     return products;
//   } catch (error) {
//     console.error("Error fetching products:", error.message);
//     return [];
//   }
// }

async function searchProducts(filters) {
  const queryParams = new URLSearchParams(filters).toString();
  const query = `/api/v1/result${queryParams ? `?${queryParams}` : ""}`;

  try {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
}

window.addEventListener("load", async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const filters = {};
  let displayText = "";

  // Retrieve filters from the address bar query
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value;
  }

  if (filters.productName) {
    displayText = filters.productName;
  } else if (filters.category) {
    switch (filters.category) {
      case "foods":
        displayText = "Food and beverages";
        break;
      case "handicrafts":
        displayText = "Handicrafts";
        break;
      case "textiles":
        displayText = "Textiles";
        break;
      case "local":
        displayText = "Local Produce";
        break;
      case "sweets":
        displayText = "Sweets and Delicacies";
        break;
      case "souvenirs":
        displayText = "Souvenirs";
        break;
      default:
        displayText = "";
        break;
    }
  }

  searchProducts(filters)
    .then((products) => {
      console.log(products);
      resultText.innerText = `${products.length} item/s found for ${displayText}`;
      if (products.length == 0) {
        const nothing = document.getElementById("nothing-img");
        nothing.style.display = "block";
      }
      products.forEach((product) => {
        createProductCards(products);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error.message);
    });
  loadLocationDropdown();
});
