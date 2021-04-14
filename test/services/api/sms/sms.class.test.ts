import { sendSms } from '@unumid/server-sdk';

import { SmsService } from '../../../../src/services/api/sms/sms.class';
import { Application } from '../../../../src/declarations';
import { dummyVerifierEntity } from '../../../mocks';

jest.mock('@unumid/server-sdk');

describe('SmsService', () => {
  describe('create', () => {
    const mockVerifierDataService = {
      getDefaultVerifierEntity: () => Promise.resolve(dummyVerifierEntity),
      patch: jest.fn()
    };

    let service: SmsService;

    beforeAll(() => {
      const app = { service: () => mockVerifierDataService } as unknown as Application;

      service = new SmsService(app);
    });

    it('sends an sms using the server sdk', async () => {
      (sendSms as jest.Mock).mockResolvedValueOnce({ authToken: dummyVerifierEntity.authToken });
      const options = {
        to: 'KL5-5555',
        deeplink: 'deeplink'
      };

      await service.create(options);
      expect(sendSms).toBeCalled();
    });
  });
});
