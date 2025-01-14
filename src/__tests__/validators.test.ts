import { validateComponentName, validateLayer } from '../index';

describe('Validators', () => {
  describe('validateComponentName', () => {
    it('should return true for valid component names', () => {
      const validNames = ['Button', 'UserProfile', 'Header123'];
      validNames.forEach((name) => {
        expect(validateComponentName(name)).toBe(true);
      });
    });

    it('should return false for invalid component names', () => {
      const invalidNames = ['button', '123Button', 'user-profile', '', ' Button'];
      invalidNames.forEach((name) => {
        expect(validateComponentName(name)).toBe(false);
      });
    });
  });

  describe('validateLayer', () => {
    const validLayers = ['pages', 'features', 'shared', 'widgets', 'entities'];

    it('should return true for valid layers', () => {
      validLayers.forEach((layer) => {
        expect(validateLayer(layer, validLayers)).toBe(true);
      });
    });

    it('should return false for invalid layers', () => {
      const invalidLayers = ['invalid', 'components', '', ' pages'];
      invalidLayers.forEach((layer) => {
        expect(validateLayer(layer, validLayers)).toBe(false);
      });
    });
  });
});
