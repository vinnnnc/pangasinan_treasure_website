// // Side Bar
// const dropdownBtn = document.querySelectorAll(".dropdown-title");
// const dropdown = document.querySelectorAll(".dropdown");
// const dropdownOptions = document.querySelectorAll(".dropdown-option");

// dropdownBtn.forEach((element, index) => {
//   element.addEventListener("click", () => {
//     dropdown[index].classList.toggle("collapsed");
//   });
// });

// dropdownOptions.forEach((element, index) => {
//   element.addEventListener("click", () => {
//     if (!element.classList.contains("dropdown-title"))
//       dropdownOptions.forEach((element) => {
//         element.classList.remove("active");
//       });
//     if (!element.classList.contains("dropdown-title")) {
//       element.classList.add("active");
//       element.parentElement.classList.add("active");
//     }
//   });
// });

// // Load Contents
// const loadManageProduct = document.getElementById("manage-products");
// const loadAddProduct = document.getElementById("add-product");
// const loadOrders = document.getElementById("orders");
// const loadReviews = document.getElementById("reviews");
// const loadStoreSettings = document.getElementById("store-settings");
// const loadAccountSettings = document.getElementById("account-settings");

// loadManageProduct.addEventListener("click", () => {
//   $(".dashboard").load("/admin/manageproducts.html");
// });
// loadAddProduct.addEventListener("click", () => {
//   $(".dashboard").load("/admin/addproduct.html");
// });
// loadOrders.addEventListener("click", () => {
//   $(".dashboard").load("/admin/orders.html");
// });
// loadReviews.addEventListener("click", () => {
//   $(".dashboard").load("/admin/reviews.html");
// });
// loadStoreSettings.addEventListener("click", () => {
//   $(".dashboard").load("/admin/storesettings.html");
// });
// loadAccountSettings.addEventListener("click", () => {
//   $(".dashboard").load("/admin/accountsettings.html");
// });

// Function to fetch all users for admin
const fetchAllUsers = async () => {
  try {
    const response = await fetch("/api/v1/users/list");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();

    // Display users in the admin page (assuming there's a container with id "user-list")
    const userListContainer = document.getElementById("user-management-table");
    userListContainer.innerHTML = `
                                  <tr>
                                  <th>User</th>
                                  <th>Full Name</th>
                                  <th>Gender</th>
                                  <th>Email Address</th>
                                  <th>Type</th>
                                  <th>Date Joined</th>
                                  <th>Action</th>
                                </tr>`; // Clear previous user list

    users.forEach((user) => {
      const userRow = document.createElement("tr");
      userRow.innerHTML = `
        <td>${user.username}</td>
        <td>${user.fullname}</td>
        <td>${user.gender}</td>
        <td>${user.email}</td>
        <td>User | Seller</td>
        <td>${user.birthdate}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      userListContainer.appendChild(userRow);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Call fetchAllUsers function to fetch and display all users in the admin page
fetchAllUsers();
