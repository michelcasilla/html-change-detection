export const logWithColor = (
  message,
  color: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "reset"
) => {
  const ansiColorCodes = {
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",
    cyan: "\u001b[36m",
    reset: "\u001b[0m",
  };

  const colorCode = ansiColorCodes[color] || ansiColorCodes.reset;
  console.log(`${colorCode}${message}${ansiColorCodes.reset}`);
};
