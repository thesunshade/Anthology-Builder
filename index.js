import { buildAnthology } from "./functions/buildAnthology.js";
import { scrollToTopButton } from "./functions/scrollToTopButton.js";
import { buildCopySaveButtons } from "./functions/buildCopySaveButtons.js";
import { helpText } from "./functions/helpText.js";

export const buildInstructions = document.querySelector("#build-instructions");
export const resultsArea = document.querySelector("#result-area");
const buildButton = document.querySelector("#build-button");
export const loadFileButton = document.querySelector("#load-file-button");
export const copyInstructionsButton = document.querySelector("#copy-instructions");
export const copyResultButton = document.querySelector("#copy-result");
export const clearButton = document.querySelector("#clear-input");
const actionMessage = document.querySelector("#action-message");
export const saveInstructionsButton = document.querySelector("#save-instructions-button");
export const saveResultsButton = document.querySelector("#save-result-button");

scrollToTopButton();
buildCopySaveButtons();
helpText();

buildButton.addEventListener("click", () => {
  buildAnthology(buildInstructions);
});
