import { PlopLogger } from '../index';
describe('PlopLogger', () => {
    let consoleLogSpy;
    let consoleErrorSpy;
    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    it('should log info messages with correct prefix', () => {
        const message = 'Test message';
        PlopLogger.info(message);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[plop-generate-component]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(message));
    });
    it('should log error messages with correct prefix', () => {
        const error = new Error('Test error');
        PlopLogger.error(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[plop-generate-component]'));
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));
    });
});
