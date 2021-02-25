import generateApp from '../../../../src/app';
import { Application } from '../../../../src/declarations';
import verifierService from '../../../../src/services/api/verifier/verifier.service';
import { hooks } from '../../../../src/services/api/verifier/verifier.hooks';

describe('initializing the verifier service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('verifier');
    expect(service).toBeDefined();
  });

  it('registers hooks', () => {
    const mockService = { hooks: jest.fn() };
    const mockApp = { service: () => mockService, use: jest.fn() } as unknown as Application;

    verifierService(mockApp);
    expect(mockService.hooks).toBeCalledWith(hooks);
  });
});
