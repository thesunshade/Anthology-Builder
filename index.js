import { saveToFile } from "./functions/saveToFile.js";
import { buildAnthology } from "./functions/buildAnthology.js";

const buildInstructions = document.querySelector("#build-instructions");
export const resultsArea = document.querySelector("#result-area");
const buildButton = document.querySelector("#build-button");
const loadFileButton = document.querySelector("#load-file-button");
const copyInstructionsButton = document.querySelector("#copy-instructions");
const copyResultButton = document.querySelector("#copy-result");
const clearButton = document.querySelector("#clear-input");
const actionMessage = document.querySelector("#action-message");
const saveInstructionsButton = document.querySelector("#save-instructions-button");
const saveResultsButton = document.querySelector("#save-result-button");

buildButton.addEventListener("click", () => {
  buildAnthology(buildInstructions);
});

// copy build instruction button
copyInstructionsButton.addEventListener("click", () => {
  navigator.clipboard.writeText(buildInstructions.value);
  const actionMessage = document.querySelector("#action-message");
  actionMessage.classList.add("fade");
  actionMessage.innerText = "Copied!";
  setTimeout(() => {
    actionMessage.innerText = "";
    actionMessage.classList.remove("fade");
  }, 1900);
});

saveInstructionsButton.addEventListener("click", () => {
  saveToFile(buildInstructions, "value");
});
saveResultsButton.addEventListener("click", () => {
  saveToFile(resultsArea, "innerHTML");
});

loadFileButton.addEventListener("click", () => {
  function loadFile() {
    // Create an input element of type 'file'
    var input = document.createElement("input");
    input.type = "file";

    // Set up an event listener to handle file selection
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (file) {
        // Use FileReader to read the contents of the file
        var reader = new FileReader();

        reader.onload = function (e) {
          // e.target.result contains the contents of the file
          var fileContent = e.target.result;
          buildInstructions.value = fileContent;
        };

        // Read the file as text
        reader.readAsText(file);
      }
    });

    // Trigger a click on the input element to open the file dialog
    input.click();
  }
  loadFile();
});
// copy results button
copyResultButton.addEventListener("click", () => {
  navigator.clipboard.writeText(resultsArea.innerHTML);

  const actionMessage = document.querySelector("#action-message");
  actionMessage.classList.add("fade");
  actionMessage.innerText = "Copied!";
  setTimeout(() => {
    actionMessage.innerText = "";
    actionMessage.classList.remove("fade");
  }, 1900);
});

// instructions clear button
clearButton.addEventListener("click", () => {
  buildInstructions.classList.add("fade-out");
  //   outputTextArea.classList.add("fade-out");

  resultsArea.innerHTML = "<i>Your anthology will appear here</i>";
  setTimeout(() => {
    buildInstructions.value = "";
    buildInstructions.classList.remove("fade-out");
    // outputTextArea.classList.remove("fade-out");
  }, 500);
  buildInstructions.focus();
});

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
