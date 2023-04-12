export const validateEnv = (requiredEnvVars: string[])=>{
	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
		throw new Error(`Missing environment variable: ${envVar}`);
		}
	}
}
  