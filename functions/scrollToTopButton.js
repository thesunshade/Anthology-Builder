export function scrollToTopButton() {
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");
  var lastScrollTop = 0;
  var isFadingIn = false;

  // Function to check if the user has scrolled approximately one screen
  function isOneScreenScrolled() {
    return window.scrollY > window.innerHeight * 0.5; // Adjust the threshold as needed
  }

  // Function to handle scroll events
  function handleScroll() {
    var st = window.scrollY;

    if (st > lastScrollTop && isOneScreenScrolled() && !isFadingIn) {
      // Scrolling down and past one screen
      fadeIn(scrollToTopBtn);
    } else if (st <= lastScrollTop || !isOneScreenScrolled()) {
      // Scrolling up or not past one screen
      fadeOut(scrollToTopBtn);
    }

    lastScrollTop = st;
  }

  // Function to fade in an element
  function fadeIn(element) {
    isFadingIn = true;
    element.style.display = "block";
    element.style.opacity = 0;

    setTimeout(function () {
      element.style.opacity = 0.8;
      isFadingIn = false;
    }, 0);
  }

  // Function to fade out an element
  function fadeOut(element) {
    element.style.opacity = 0;
    setTimeout(function () {
      element.style.display = "none";
    }, 500); // Adjust the duration of the fade-out transition
  }

  // Event listener for scroll events
  window.addEventListener("scroll", handleScroll);

  // Event listener for button click (for testing purposes)
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
