import generateApp from '../../../../src/app';
import { Application } from '../../../../src/declarations';
import { hooks } from '../../../../src/services/api/presentationV2/presentationV2.hooks';
import presentationService from '../../../../src/services/api/presentationV2/presentationV2.service';

describe('initializing the presentation V2 service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('presentation');
    expect(service).toBeDefined();
  });

  it('registers hooks', () => {
    const mockService = { hooks: jest.fn() };
    const mockApp = { service: () => mockService, use: jest.fn() } as unknown as Application;

    presentationService(mockApp);
    expect(mockService.hooks).toBeCalledWith(hooks);
  });
});
