export class PlopLogger {
  static info(message: string) {
    console.log(`[plop-generate-component] ${message}`);
  }

  static error(error: Error) {
    console.error(`[plop-generate-component] Error: ${error.message}`);
  }
}
