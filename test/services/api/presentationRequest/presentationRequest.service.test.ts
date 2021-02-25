import generateApp from '../../../../src/app';
import { Application } from '../../../../src/declarations';
import { hooks } from '../../../../src/services/api/presentationRequest/presentationRequest.hooks';
import presentationRequestService from '../../../../src/services/api/presentationRequest/presentationRequest.service';

describe('initializing the presentationRequest service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('presentationRequest');
    expect(service).toBeDefined();
  });

  it('registers hooks', () => {
    const mockService = { hooks: jest.fn() };
    const mockApp = { service: () => mockService, use: jest.fn() } as unknown as Application;

    presentationRequestService(mockApp);
    expect(mockService.hooks).toBeCalledWith(hooks);
  });
});
