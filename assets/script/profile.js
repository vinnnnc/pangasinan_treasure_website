function loadEditProfile() {
  $(".right-section").load("/profile/profile_edit.html");
}
function loadAddress() {
  $(".right-section").load("/profile/profile_address.html");
}
function loadCancellations() {
  $(".right-section").load("/profile/profile_cancellations.html");
}
function loadOrders() {
  $(".right-section").load("/profile/profile_orders.html");
}
function loadPayment() {
  $(".right-section").load("/profile/profile_payment.html");
}
function loadReturns() {
  $(".right-section").load("/profile/profile_returns.html");
}

const links = document.querySelectorAll(".left-section a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
