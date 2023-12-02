import { buildAdditionalText } from "./buildAdditionalText.js";
import { buildSutta } from "./buildSutta.js";
import { generateTableOfContents } from "./generateTableOfContents.js";
import parseInstructions from "./parseInstructions.js";
import { markupCode } from "./markupCode.js";
import { resultsArea } from "../index.js";

export function buildAnthology(buildInstructions) {
  const instructions = parseInstructions(buildInstructions);

  closeAllDetails();

  if (!buildInstructions.value) {
    resultsArea.innerHTML = `<p class="error">You'll need to add some build instruction first. Click on Help to learn more.</p>`;

    return;
  }
  resultsArea.innerHTML = "";

  function closeAllDetails() {
    let detailsElements = document.querySelectorAll("details");

    detailsElements.forEach(function (details) {
      details.open = false;
    });
  }

  const requests = instructions.map(instruction => {
    if (!markupCode(instruction)) {
      let suttaId = instruction.split(/:|>/)[0];

      // Make the first API call (bilara)
      const bilaraPromise = fetch(`https://suttacentral.net/api/bilarasuttas/${suttaId.toLowerCase()}/sujato?lang=en`).then(response => response.json());

      // Make the second API call (suttaplex)
      const suttaplexPromise = fetch(`https://suttacentral.net/api/suttaplex/${suttaId.toLowerCase()}/?lang=en`).then(response => response.json());

      // Return a promise that resolves to the final object
      return Promise.all([bilaraPromise, suttaplexPromise]).then(([bilaraData, suttaplexData]) => ({
        bilara: bilaraData,
        suttaplex: suttaplexData,
        instruction: instruction,
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
      if (localStorage.includeTableOfContents == "true") {
        generateTableOfContents();
      }
      // end processing
    })
    .catch(error => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}
