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
