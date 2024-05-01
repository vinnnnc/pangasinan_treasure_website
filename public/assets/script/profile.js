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
      rightSection.innerHTML = data;
      link.classList.add("active");
      if (link.id === "my-account-title")
        document.getElementById("manage-account").classList.add("active");
      else if (link.id === "my-orders-title")
        document.getElementById("my-orders").classList.add("active");
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
    "profile_orders.html",
    document.querySelector(".profile-links div:first-child")
  );
  document.getElementById("my-account-title").classList.add("active");
}
