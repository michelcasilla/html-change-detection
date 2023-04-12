import { logWithColor } from "./logger";

export const validateEnv = (requiredEnvVars: string[])=>{
	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			throw new Error(`Missing environment variable: ${envVar}`);
		}else{
			logWithColor(`${envVar}: ${process.env[envVar]}`, 'green');
		}
	}
}
  