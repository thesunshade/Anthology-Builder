export function generateTableOfContents() {
  const resultArea = document.getElementById("result-area");
  const headings = resultArea.querySelectorAll("h1, h2, h3, h4, h5, h6");
  console.log(headings);
  if (!resultArea || headings.length === 0) {
    console.error("No result area or headings found.");
    return;
  }

  const tocList = document.createElement("ul");
  let currentList = tocList;
  let lastLevel = 1;

  headings.forEach((heading, index) => {
    // Add IDs to headings if they don't have one
    if (!heading.id) {
      heading.id = "heading" + (index + 1);
    }

    const level = parseInt(heading.tagName.charAt(1));

    if (level > lastLevel) {
      // Create a nested list for subheadings
      const sublist = document.createElement("ul");
      currentList.lastElementChild.appendChild(sublist);
      currentList = sublist;
    } else if (level < lastLevel) {
      // Move back to the parent list for higher-level headings
      for (let i = level; i < lastLevel; i++) {
        currentList = currentList.parentElement.parentElement;
      }
    }

    // Create list item and anchor for each heading
    const listItem = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#" + heading.id;
    anchor.textContent = heading.textContent;
    listItem.appendChild(anchor);
    currentList.appendChild(listItem);

    // Update lastLevel for the next iteration
    lastLevel = level;
  });

  // Insert the generated Table of Contents as the first element within result-area
  resultArea.insertAdjacentElement("afterbegin", tocList);
  console.log("end");
}
