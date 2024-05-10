document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("register-btn");
  const agreementCheckbox = document.getElementById("agreement");
  const nameInput = document.getElementById("store-name");
  const locationSelect = document.getElementById("location-dropdown");
  const profilePicInput = document.getElementById("store-profile");

  agreementCheckbox.addEventListener("change", () => {
    if (agreementCheckbox.checked) {
      registerBtn.classList.remove("disabled");
    } else {
      registerBtn.classList.add("disabled");
    }
  });

  registerBtn.addEventListener("click", async (event) => {
    if (!agreementCheckbox.checked) {
      alert("Please agree to the Marketplace Agreement");
      return;
    }

    const name = nameInput.value.trim();
    const location = locationSelect.value;
    const profilePicFile = profilePicInput.files[0];

    if (!name) {
      alert("Please enter a store name");
      return;
    }
    if (location === "default") {
      alert("Please select a store location");
      return;
    }
    if (!profilePicFile) {
      alert("Please select a store icon (profile picture)");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("profilePic", profilePicFile);
    formData.append("userId", localStorage.getItem("userId"));
    console.log(...formData);
    try {
      const response = await fetch("/api/v1/seller/", {
        method: "POST",
        header: "multipart/form-data",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to register as seller");
      }

      const data = await response.json();
      console.log("Seller registration successful:", data);
      window.location.href = "/seller/dashboard";
    } catch (error) {
      console.error("Error registering as seller:", error.message);
    }
  });
});
