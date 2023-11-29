const buildInstructions = document.querySelector("#build-instructions");
const outputTextArea = document.querySelector("#output-text");
const buildButton = document.querySelector("#build-button");
const copyInstructionsButton = document.querySelector("#copy-instructions");
const copyResultButton = document.querySelector("#copy-result");
const clearButton = document.querySelector("#clear-input");

function parseInstructions() {
  const instructions = buildInstructions.value.split(/\r?\n/).map(line => line.trim());
  return instructions;
}

buildButton.addEventListener("click", () => {
  const instructions = parseInstructions();
  console.log(instructions);
  const requests = instructions.map(instruction => {
    console.log(!markupCode(instruction) + " " + instruction);
    if (!markupCode(instruction)) {
      // Make the first API call (bilara)
      const bilaraPromise = fetch(`https://suttacentral.net/api/bilarasuttas/${instruction}/sujato?lang=en`).then(response => response.json());

      // Make the second API call (suttaplex)
      const suttaplexPromise = fetch(`https://suttacentral.net/api/suttaplex/${instruction}/?lang=en`).then(response => response.json());

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
          anthologyText += buildSutta(response);
        } else {
          anthologyText += buildAdditionalText(response);
        }
      }
      outputTextArea.innerHTML = anthologyText;
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

// action message
const actionMessage = document.querySelector("#action-message");
// actionMessage.innerText = "Linked up!";
// actionMessage.classList.add("fade");
// setTimeout(() => {
//   actionMessage.innerText = "";
//   actionMessage.classList.remove("fade");
// }, 1900);

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

// copy results button
copyResultButton.addEventListener("click", () => {
  navigator.clipboard.writeText(outputTextArea.innerHTML);

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

  outputTextArea.innerText = "";
  setTimeout(() => {
    buildInstructions.value = "";
    buildInstructions.classList.remove("fade-out");
    // outputTextArea.classList.remove("fade-out");
  }, 500);
});
