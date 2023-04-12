"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const logger_1 = require("./logger");
const validateEnv = (requiredEnvVars) => {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        }
        else {
            (0, logger_1.logWithColor)(`${envVar}: ${process.env[envVar]}`, 'green');
        }
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=validate.js.map