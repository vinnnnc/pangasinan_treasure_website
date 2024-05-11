// Side Bar
const dropdownBtn = document.querySelectorAll(".dropdown-title");
const dropdown = document.querySelectorAll(".dropdown");
const dropdownOptions = document.querySelectorAll(".dropdown-option");

dropdownBtn.forEach((element, index) => {
  element.addEventListener("click", () => {
    dropdown[index].classList.toggle("collapsed");
  });
});

dropdownOptions.forEach((element, index) => {
  element.addEventListener("click", () => {
    if (!element.classList.contains("dropdown-title"))
      dropdownOptions.forEach((element) => {
        element.classList.remove("active");
      });
    if (!element.classList.contains("dropdown-title")) {
      element.classList.add("active");
      element.parentElement.classList.add("active");
    }
  });
});

// Load Contents
const loadDashboard = document.getElementById("option-dashboard");
const loadUsers = document.getElementById("option-users");
const loadHomepage = document.getElementById("option-homepage");
const loadAccountSettings = document.getElementById("option-account-settings");
const loadAdmins = document.getElementById("option-admins");

loadDashboard.addEventListener("click", () => {
  $(".dashboard").load("/admin/overview.html");
  loadScripts();
});
loadUsers.addEventListener("click", () => {
  $(".dashboard").load("/admin/users.html");
  loadScripts();
});
loadHomepage.addEventListener("click", () => {
  $(".dashboard").load("/admin/homepage.html");
  loadScripts();
});
loadAccountSettings.addEventListener("click", () => {
  $(".dashboard").load("/admin/accountsettings.html");
  loadScripts();
});
loadAdmins.addEventListener("click", () => {
  $(".dashboard").load("/admin/administrators.html");
  loadScripts();
});

function loadScripts() {
  const scripts = document
    .querySelector(".dashboard")
    .getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    eval(scripts[i].innerHTML); // Execute the script
  }
}
