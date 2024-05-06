async function fetchUserProfile(userId) {
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

function myInit() {
  userId = localStorage.getItem("userId");
  fetchUserProfile(userId)
    .then((userData) => {
      if (userData) {
        console.log("User Profile:", userData);

        const username = document.getElementById("profile-uname");
        const name = document.getElementById("profile-name");
        const email = document.getElementById("profile-email");
        const phone = document.getElementById("profile-phone");
        const gender = document.getElementById("profile-gender");
        const date = document.getElementById("profile-birthdate");

        name.value = userData.fullName;
        username.value = userData.username;
        email.value = userData.email;
        phone.value = userData.phone;
        gender.value = userData.gender;
        date.value = userData.birthdate;
      } else {
        console.log("User profile not found");
        // Handle case where user profile is not found
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error.message);
      // Handle the error, display message, etc.
    });
}
myInit();

window.addEventListener("load", myInit, true);
