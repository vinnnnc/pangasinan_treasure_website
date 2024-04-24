const slidesContainer = document.getElementById("slides-container");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
const sliderPage1 = document.getElementById("page-1");
const sliderPage2 = document.getElementById("page-2");
const sliderPage3 = document.getElementById("page-3");
const sliderPage = [sliderPage1, sliderPage2, sliderPage3];
var pageInterval = setInterval(nextSlider, 5000);

const slides = ["slide-1", "slide-2", "slide-3"];
var slideNumber = 0;

nextButton.addEventListener("click", () => {
  nextSlider();
});

prevButton.addEventListener("click", () => {
  prevSlider();
});

sliderPage1.addEventListener("click", () => {
  slideNumber = 0;
  changeSlide();
});

sliderPage2.addEventListener("click", () => {
  slideNumber = 1;
  changeSlide();
});

sliderPage3.addEventListener("click", () => {
  slideNumber = 2;
  changeSlide();
});

function nextSlider() {
  slideNumber++;
  changeSlide();
}

function prevSlider() {
  slideNumber--;
  changeSlide();
}

function changeSlide() {
  if (slideNumber < 0) slideNumber = 2;
  if (slideNumber > 2) slideNumber = 0;
  for (i = 0; i < 3; i++) {
    slidesContainer.classList.remove(slides[i]);
    sliderPage[i].classList.remove("slider-active");
  }
  sliderPage[slideNumber].classList.add("slider-active");
  slidesContainer.classList.add(slides[slideNumber]);
  clearInterval(pageInterval);
  pageInterval = setInterval(nextSlider, 5000);
}
