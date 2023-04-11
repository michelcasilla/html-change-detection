"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWithColor = void 0;
const logWithColor = (message, color) => {
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
exports.logWithColor = logWithColor;
//# sourceMappingURL=logger.js.map