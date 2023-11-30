export default function parseInstructions(buildInstructions) {
  const specialPrefixes = ["DN", "MN", "SN", "AN", "Kp", "Dhp", "Ud", "Snp", "Thag", "Thig"];

  const instructions = buildInstructions.value
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
  console.log(instructions);
  return instructions;
}
