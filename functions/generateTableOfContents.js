export function generateTableOfContents() {
  const resultArea = document.getElementById("result-area");
  const headings = resultArea.querySelectorAll("h1, h2, h3, h4, h5, h6");

  if (!resultArea || headings.length === 0) {
    console.error("No result area or headings found.");
    return;
  }

  const tocList = document.createElement("ul");
  let currentList = tocList;
  let lastLevel = 1;

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = "heading" + (index + 1);
    }

    const level = parseInt(heading.tagName.charAt(1));

    // Ensure the level is within the valid range
    const adjustedLevel = Math.min(Math.max(level, 1), 6);

    // Adjust the list structure if needed
    while (adjustedLevel > lastLevel) {
      const sublist = document.createElement("ul");
      currentList.appendChild(sublist);
      currentList = sublist;
      lastLevel++;
    }

    while (adjustedLevel < lastLevel) {
      currentList = currentList.parentElement.parentElement;
      lastLevel--;
    }

    // Create list item and anchor for each heading
    const listItem = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#" + heading.id;
    anchor.textContent = heading.textContent;
    listItem.appendChild(anchor);
    currentList.appendChild(listItem);
  });

  // Insert the generated Table of Contents as the first element within result-area
  resultArea.insertAdjacentElement("afterbegin", tocList);
  console.log("end");
}
