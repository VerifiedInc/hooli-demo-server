import { sendSms, UnumDto } from '@unumid/server-sdk';
import { GeneralError } from '@feathersjs/errors';

import { Application } from '../../../declarations';
import logger from '../../../logger';

export interface SmsOptions {
  to: string;
  msg: string;
}

export class SmsService {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async create (options: SmsOptions): Promise<UnumDto<undefined>> {
    const verifierDataService = this.app.service('verifierData');
    const verifier = await verifierDataService.getDefaultVerifierEntity();

    let result: UnumDto<undefined>;

    try {
      result = await sendSms(verifier.authToken, options.to, options.msg);
    } catch (e) {
      logger.error('SmsService.create caught an error thrown by ServerSDK.sendSms', e);
      throw new GeneralError('Error sending sms', e);
    }

    if (result.authToken !== verifier.authToken) {
      try {
        await verifierDataService.patch(verifier.uuid, { authToken: result.authToken });
      } catch (e) {
        logger.error('SmsService.create caught an error thrown by VerifierDataService.patch', e);
      }
    }
    return result;
  }
}
