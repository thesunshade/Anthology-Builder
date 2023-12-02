import { saveToFile } from "./saveToFile.js";
import { copyInstructionsButton, buildInstructions, saveInstructionsButton, saveResultsButton, resultsArea, loadFileButton, copyResultButton, clearButton } from "../index.js";

export function buildCopySaveButtons() {
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
}
