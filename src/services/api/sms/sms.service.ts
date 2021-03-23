import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { SmsService } from './sms.class';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    sms: SmsService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  app.use('/sms', new SmsService(app));
}
