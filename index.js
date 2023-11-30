import { buildAdditionalText } from "./functions/buildAdditionalText.js";
import { buildSutta } from "./functions/buildSutta.js";
import { generateTableOfContents } from "./functions/generateTableOfContents.js";
import parseInstructions from "./functions/parseInstructions.js";
import { saveToFile } from "./functions/saveToFile.js";
import { markupCode } from "./functions/markupCode.js";

const buildInstructions = document.querySelector("#build-instructions");
const resultsArea = document.querySelector("#result-area");
const buildButton = document.querySelector("#build-button");
const copyInstructionsButton = document.querySelector("#copy-instructions");
const copyResultButton = document.querySelector("#copy-result");
const clearButton = document.querySelector("#clear-input");
const actionMessage = document.querySelector("#action-message");

buildButton.addEventListener("click", () => {
  const instructions = parseInstructions(buildInstructions);
  console.log(!buildInstructions.value);
  if (!buildInstructions.value) {
    resultsArea.innerHTML = `<p class="error">You'll need to add some build instruction first. Click on Help to learn more.</p>`;

    return;
  }
  resultsArea.innerHTML = "";

  const requests = instructions.map(instruction => {
    if (!markupCode(instruction)) {
      // Make the first API call (bilara)
      const bilaraPromise = fetch(`https://suttacentral.net/api/bilarasuttas/${instruction.toLowerCase()}/sujato?lang=en`).then(response => response.json());

      // Make the second API call (suttaplex)
      const suttaplexPromise = fetch(`https://suttacentral.net/api/suttaplex/${instruction.toLowerCase()}/?lang=en`).then(response => response.json());

      // Return a promise that resolves to the final object
      return Promise.all([bilaraPromise, suttaplexPromise]).then(([bilaraData, suttaplexData]) => ({
        bilara: bilaraData,
        suttaplex: suttaplexData,
      }));
    } else {
      // If the instruction doesn't contain numbers, treat it as a resolved promise with a placeholder value
      return Promise.resolve({ error: "text", content: instruction });
    }
  });

  Promise.all(requests)
    .then(data => {
      // Process the data from all API calls here

      let anthologyText = "";

      for (let i = 0; i < data.length; i++) {
        const response = data[i];
        if (!response.error) {
          if (response.bilara.msg === "Not Found") {
            console.log(instructions[i]);
            resultsArea.innerHTML = `<p class="error">The line:</p>
            <pre>${instructions[i]}</pre>
            <p class="error">is either an incorrect sutta ID or it is added text with a missing prefix (h1, h2, etc.)</p>`;
          }
          anthologyText += buildSutta(response);
        } else {
          anthologyText += buildAdditionalText(response);
        }
      }
      resultsArea.innerHTML = anthologyText;
      resultsArea.setAttribute("contenteditable", "true");
      resultsArea.setAttribute("spellcheck", "false");

      function removeElements(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function (element) {
          element.remove();
        });
      }

      removeElements("header");
      removeElements("p.endkanda");
      removeElements("blockquote.uddanagatha");
      generateTableOfContents();
      // end processing
    })
    .catch(error => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
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
});
