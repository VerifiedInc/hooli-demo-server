import generateApp from '../../../../src/app';

describe('initializing the session service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('session');
    expect(service).toBeDefined();
  });
});
