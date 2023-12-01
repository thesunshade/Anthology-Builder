import { saveToFile } from "./functions/saveToFile.js";
import { buildAnthology } from "./functions/buildAnthology.js";

const buildInstructions = document.querySelector("#build-instructions");
export const resultsArea = document.querySelector("#result-area");
const buildButton = document.querySelector("#build-button");
const copyInstructionsButton = document.querySelector("#copy-instructions");
const copyResultButton = document.querySelector("#copy-result");
const clearButton = document.querySelector("#clear-input");
const actionMessage = document.querySelector("#action-message");

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

const saveInstructionsButton = document.querySelector("#save-instructions-button");
const saveResultsButton = document.querySelector("#save-result-button");

saveInstructionsButton.addEventListener("click", () => {
  saveToFile(buildInstructions, "value");
});
saveResultsButton.addEventListener("click", () => {
  saveToFile(resultsArea, "innerHTML");
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
