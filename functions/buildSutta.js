export function buildSutta(response) {
  console.log(response);
  const bilara = response.bilara;
  const suttaplex = response.suttaplex[0];
  const instruction = response.instruction;
  let [suttaId, range] = instruction.split(":");
  let testForBaked = suttaId.split(">");
  if (testForBaked[1] == undefined) {
    suttaId = testForBaked[0];
  } else {
    suttaId = testForBaked[1];
  }

  suttaId = suttaId.toLowerCase();
  console.log(suttaId, range);
  const { html_text, translation_text, root_text, keys_order } = bilara;

  let keys = [...keys_order];

  let suttaTitlesMarkup = "h3";
  if (localStorage.suttaTitlesMarkup) {
    suttaTitlesMarkup = localStorage.suttaTitlesMarkup;
  }

  let htmlText = "";
  let htmlTitle = `<${suttaTitlesMarkup}>${range ? "From " : ""}${suttaplex.acronym} ${suttaplex.original_title}: ${suttaplex.translated_title}</${suttaTitlesMarkup}>`;
  htmlText += htmlTitle;

  if (range) {
    let [start, end] = range.split("-");
    let startRange = `${suttaId}:${start}`;
    let endRange = `${suttaId}:${end}`;

    console.log(startRange, endRange);
    console.log(keys_order);

    const startIndex = keys_order.indexOf(startRange);
    const endIndex = keys_order.indexOf(endRange);

    if (startIndex !== -1 && endIndex !== -1) {
      keys = keys_order.slice(startIndex, endIndex + 1);
    } else {
      console.log("Start or end range not found in the array");
    }
  }
  keys.forEach(segment => {
    if (translation_text[segment] === undefined) {
      translation_text[segment] = "";
    }
    let [openHtml, closeHtml] = html_text[segment].split(/{}/);

    if (openHtml == "<span class='verse-line'>") {
      openHtml = "<br>" + openHtml;
    }

    htmlText += `${openHtml}<span class="segment" id ="${segment}" class="eng-lang" lang="en">${translation_text[segment]}</span>${closeHtml}\n\n`;
  });
  const correctedHtml = closeUnclosedTags(htmlText);
  return correctedHtml;
}

function closeUnclosedTags(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const correctedHtml = new XMLSerializer().serializeToString(doc);

  return correctedHtml;
}
