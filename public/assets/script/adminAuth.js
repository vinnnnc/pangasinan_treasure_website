// Function to check if user is an admin
function isUserAdmin() {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin === "true"; // Convert to boolean if needed
}

if (!isUserAdmin()) {
  window.location.href = "/";
}
