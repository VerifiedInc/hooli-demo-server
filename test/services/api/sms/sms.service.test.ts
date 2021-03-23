import generateApp from '../../../../src/app';

describe('initializing the sms service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('sms');
    expect(service).toBeDefined();
  });
});
