import { markupCode } from "./markupCode.js";

export function buildAdditionalText(response) {
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
