const buildInstructions = document.querySelector("#build-instructions");
const resultsArea = document.querySelector("#result-area");
const buildButton = document.querySelector("#build-button");
const copyInstructionsButton = document.querySelector("#copy-instructions");
const copyResultButton = document.querySelector("#copy-result");
const clearButton = document.querySelector("#clear-input");
const actionMessage = document.querySelector("#action-message");

function parseInstructions(buildInstructions) {
  const instructions = buildInstructions.value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== "");
  return instructions;
}

buildButton.addEventListener("click", () => {
  const instructions = parseInstructions(buildInstructions);
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

      // Select all <header> elements
      var headerElements = document.querySelectorAll("header");

      // Loop through each <header> element and remove it
      headerElements.forEach(function (headerElement) {
        headerElement.remove();
      });

      // end processing
    })
    .catch(error => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
});

function buildSutta(response) {
  const bilara = response.bilara;
  const suttaplex = response.suttaplex[0];
  console.log(bilara);
  console.log(response);

  const { html_text, translation_text, root_text, keys_order } = bilara;

  let htmlText = "";
  htmlText += `<h3>${suttaplex.acronym} ${suttaplex.original_title}: ${suttaplex.translated_title}</h3>`;

  keys_order.forEach(segment => {
    if (translation_text[segment] === undefined) {
      translation_text[segment] = "";
    }
    let [openHtml, closeHtml] = html_text[segment].split(/{}/);

    if (openHtml == "<span class='verse-line'>") {
      openHtml = "<br>" + openHtml;
    }

    htmlText += `${openHtml}<span class="segment" id ="${segment}" class="eng-lang" lang="en">${translation_text[segment]}</span>${closeHtml}\n\n`;
  });

  return htmlText;
}

function markupCode(text) {
  const markup = ["p", "h1", "h2"];
  // Convert the text to lowercase for case-insensitive comparison
  const lowerText = text.toLowerCase();
  // Check if any markup item is at the beginning of the text
  const foundMarkup = markup.find(item => lowerText.startsWith(item));
  return foundMarkup;
}

function buildAdditionalText(response) {
  const text = response.content;
  const foundMarkup = markupCode(text);

  if (foundMarkup) {
    // If yes, add HTML markup
    return `<${foundMarkup} class="added">${text.slice(foundMarkup.length).trim()}</${foundMarkup}>`;
  } else {
    // If not, return the original text
    return ERROR;
  }
}

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

function saveToFile(contentElement, contentProperty) {
  const fileName = prompt("Enter a name for the file:");
  if (fileName) {
    const fileContent = contentProperty === "value" ? contentElement.value : contentElement.innerHTML;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".txt";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const actionMessage = document.querySelector("#action-message");
    actionMessage.classList.add("fade");
    actionMessage.innerText = "File saved!";
    setTimeout(() => {
      actionMessage.innerText = "";
      actionMessage.classList.remove("fade");
    }, 1900);
  }
}

saveInstructionsButton.addEventListener("click", () => {
  saveToFile(buildInstructions, "value");
});
saveResultsButton.addEventListener("click", () => {
  console.log(resultsArea);
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

  resultsArea.innerText = "";
  setTimeout(() => {
    buildInstructions.value = "";
    buildInstructions.classList.remove("fade-out");
    // outputTextArea.classList.remove("fade-out");
  }, 500);
});
