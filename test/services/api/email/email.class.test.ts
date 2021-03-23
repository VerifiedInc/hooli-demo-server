import { sendEmail } from '@unumid/server-sdk';

import { EmailService } from '../../../../src/services/api/email/email.class';
import { Application } from '../../../../src/declarations';
import { dummyVerifierEntity } from '../../../mocks';

jest.mock('@unumid/server-sdk');

describe('EmailService', () => {
  describe('create', () => {
    const mockVerifierDataService = {
      getDefaultVerifierEntity: () => Promise.resolve(dummyVerifierEntity),
      patch: jest.fn()
    };

    let service: EmailService;

    beforeAll(() => {
      const app = { service: () => mockVerifierDataService } as unknown as Application;

      service = new EmailService(app);
    });

    it('sends an email using the server sdk', async () => {
      (sendEmail as jest.Mock).mockResolvedValueOnce({ authToken: dummyVerifierEntity.authToken });
      const options = {
        to: 'test@unum.id',
        subject: 'test',
        htmlBody: '<div>test</div>'
      };

      await service.create(options);
      expect(sendEmail).toBeCalled();
    });
  });
});
