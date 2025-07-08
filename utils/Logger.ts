class Logger {
private static instance: Logger;
private constructor() {}

static getInstance(): Logger {
if (!Logger.instance) {
Logger.instance = new Logger();
}
return Logger.instance;
}

log(message: string) {
console.log(`[LOG] ${new Date().toISOString()} ${message}`);
}

info(message: string) {
console.info(`[INFO] ${new Date().toISOString()} ${message}`);
}

error(message: string) {
console.error(`[ERROR] ${new Date().toISOString()} ${message}`);
}
}


export default Logger.getInstance();
