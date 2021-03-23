import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { EmailService } from './email.class';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    email: EmailService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  app.use('/email', new EmailService(app));
}
