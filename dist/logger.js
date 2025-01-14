export class PlopLogger {
    static info(message) {
        console.log(`[plop-generate-component] ${message}`);
    }
    static error(error) {
        console.error(`[plop-generate-component] Error: ${error.message}`);
    }
}
