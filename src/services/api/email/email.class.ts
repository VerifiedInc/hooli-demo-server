import { sendEmail, UnumDto } from '@unumid/server-sdk';
import { GeneralError } from '@feathersjs/errors';

import { Application } from '../../../declarations';
import logger from '../../../logger';

export interface EmailOptions {
  to: string;
  deeplink: string;
}

export class EmailService {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async create (options: EmailOptions): Promise<UnumDto<undefined>> {
    const verifierDataService = this.app.service('verifierData');
    const verifier = await verifierDataService.getDefaultVerifierEntity();

    let result: UnumDto<undefined>;

    try {
      result = await sendEmail(verifier.authToken, options.to, options.deeplink);
    } catch (e) {
      logger.error('EmailService.create caught an error thrown by ServerSDK.sendEmail', e);
      throw new GeneralError('Error sending email', e);
    }

    if (result.authToken !== verifier.authToken) {
      try {
        await verifierDataService.patch(verifier.uuid, { authToken: result.authToken });
      } catch (e) {
        logger.error('EmailService.create caught an error thrown by VerifierDataService.patch', e);
      }
    }
    return result;
  }
}
