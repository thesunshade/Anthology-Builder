export function buildSutta(response) {
  const bilara = response.bilara;
  const suttaplex = response.suttaplex[0];
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
