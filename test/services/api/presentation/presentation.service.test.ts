import generateApp from '../../../../src/app';
import { Application } from '../../../../src/declarations';
import { hooks } from '../../../../src/services/api/presentation/presentation.hooks';
import presentationService from '../../../../src/services/api/presentation/presentation.service';

describe('initializing the presentation service', () => {
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
