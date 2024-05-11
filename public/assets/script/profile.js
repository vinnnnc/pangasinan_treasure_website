const profileLinks = document.querySelectorAll(".profile-links div");
const rightSection = document.querySelector(".right-section");

profileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const html = getHtmlPath(link.id);
    loadContent(html, link);
    setTitle(link.classList.contains("orders-link") ? 2 : 1);
  });
});

function getHtmlPath(linkId) {
  switch (linkId) {
    case "manage-account":
    case "my-account-title":
      return "profile_edit.html";
    case "payment-options":
      return "profile_payment.html";
    case "address-book":
      return "profile_address.html";
    case "my-wallet":
      return "profile_wallet.html";
    case "my-orders":
    case "my-orders-title":
      return "profile_orders.html";
    case "my-returns":
      return "profile_returns.html";
    case "my-cancellations":
      return "profile_cancellations.html";
    default:
      return "";
  }
}

function loadContent(html, link) {
  profileLinks.forEach((element) => {
    element.classList.remove("active");
  });

  rightSection.innerHTML = ""; // Clear previous content
  rightSection.insertAdjacentHTML(
    "beforeend",
    `<div class="loading">Loading...</div>`
  );
  fetch(`/profile/${html}`, {
    headers: {
      Accept: "text/html",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      link.classList.add("active");
      if (link.id === "my-account-title")
        document.getElementById("manage-account").classList.add("active");
      else if (link.id === "my-orders-title")
        document.getElementById("my-orders").classList.add("active");
      rightSection.innerHTML = data;

      const scripts = rightSection.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerHTML); // Execute the script
      }
    })
    .catch((error) => console.error("Error loading content:", error));
}

function setTitle(num) {
  profileLinks.forEach((link) => {
    link.classList.remove("active");
  });
  document
    .getElementById(num === 1 ? "my-account-title" : "my-orders-title")
    .classList.add("active");
}

function loadDefault() {
  loadContent(
    "../profile/profile_edit.html",
    document.querySelector(".profile-links div:first-child")
  );
  document.getElementById("my-account-title").classList.add("active");
}

// Function to fetch user profile details
// async function fetchUserProfile(userId) {
//   try {
//     const response = await fetch(`/api/v1/users/list/${userId}`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const userData = await response.json();
//     return userData;
//   } catch (error) {
//     console.error("Error fetching user profile:", error.message);
//     return null; // Or handle the error as needed
//   }
// }

// window.addEventListener("load", myInit, true);

// function myInit() {
//   userId = localStorage.getItem("userId");
//   // Example usage
//   fetchUserProfile(userId)
//     .then((userData) => {
//       if (userData) {
//         console.log("User Profile:", userData);
//         // Update UI or perform actions based on user profile data
//       } else {
//         console.log("User profile not found");
//         // Handle case where user profile is not found
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching user profile:", error.message);
//       // Handle the error, display message, etc.
//     });
// }

// function editProfile(userData) {
//   const username = document.getElementById("profile-uname");
//   const name = document.getElementById("profile-name");
//   const email = document.getElementById("profile-email");
//   const phone = document.getElementById("profile-phone");
//   const gender = document.getElementById("profile-gender");
//   const date = document.getElementById("profile-birthdate");

//   username.value = userData.name;
// }

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
