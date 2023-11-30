export function saveToFile(contentElement, contentProperty) {
  const fileName = prompt("Enter a name for the file:");
  if (fileName) {
    const fileContent = contentProperty === "value" ? contentElement.value : contentElement.innerHTML;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    let extension = ".txt";
    if (contentProperty == "innerHTML") extension = ".html";
    a.download = fileName + extension;
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
