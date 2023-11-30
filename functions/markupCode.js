export function markupCode(text) {
  const markup = ["p", "h1", "h2"];
  // Convert the text to lowercase for case-insensitive comparison
  const lowerText = text.toLowerCase();
  // Check if any markup item is at the beginning of the text
  const foundMarkup = markup.find(item => lowerText.startsWith(item));
  return foundMarkup;
}
