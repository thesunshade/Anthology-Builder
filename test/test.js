import ClipboardJS from "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.esm.min.mjs";

document.addEventListener("DOMContentLoaded", function () {
  var clipboard = new ClipboardJS("#copyButton");

  clipboard.on("success", function (e) {
    e.clearSelection();
  });

  clipboard.on("error", function (e) {
    console.error("Unable to copy rich text to clipboard", e);
  });
});
