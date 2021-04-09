import generateApp from '../../../src/app';

describe('PresentationDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('presentationWebsocket');
      expect(service).toBeDefined();
    });
  });
});
