import generateApp from '../../../../src/app';
import { Application } from '../../../../src/declarations';
import { hooks } from '../../../../src/services/api/session/session.hooks';
import sessionService from '../../../../src/services/api/session/session.service';

describe('initializing the session service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('session');
    expect(service).toBeDefined();
  });

  it('registers hooks', () => {
    const mockService = { hooks: jest.fn() };
    const mockApp = { service: () => mockService, use: jest.fn() } as unknown as Application;

    sessionService(mockApp);
    expect(mockService.hooks).toBeCalledWith(hooks);
  });
});
