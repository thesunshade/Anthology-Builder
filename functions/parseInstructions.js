export default function parseInstructions(buildInstructions) {
  const specialPrefixes = ["DN", "MN", "SN", "AN", "Kp", "Dhp", "Ud", "Snp", "Thag", "Thig"];

  localStorage.clear();

  // Check if buildInstructions.value contains a JSON object
  const jsonRegex = /^\s*\{[\s\S]*?\}\s*/;
  const jsonMatch = buildInstructions.value.match(jsonRegex);

  if (jsonMatch) {
    const jsonString = jsonMatch[0];
    const jsonObject = JSON.parse(jsonString);

    // Save each key-value pair individually to localStorage
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        localStorage.setItem(key, jsonObject[key]);
      }
    }

    // Remove the JSON object from buildInstructions.value
    // buildInstructions.value = buildInstructions.value.replace(jsonRegex, "");
  }

  const instructions = buildInstructions.value
    .replace(jsonRegex, "")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== "")
    .filter(line => !line.startsWith("(")) // Filter out lines starting with '('
    .map(line => {
      for (const prefix of specialPrefixes) {
        if (line.toUpperCase().startsWith(prefix.toUpperCase())) {
          const prefixLength = prefix.length;
          const trimmedLine = line.substring(prefixLength).trimLeft();
          return `${prefix}${trimmedLine}`;
        }
      }
      return line;
    });

  return instructions;
}
