import generateApp from '../../../../src/app';

describe('initializing the email service', () => {
  it('registers with the app', async () => {
    const app = await generateApp();
    const service = app.service('email');
    expect(service).toBeDefined();
  });
});
