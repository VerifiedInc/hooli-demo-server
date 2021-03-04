import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { SessionService } from './session.class';
import { Session } from '../../../entities/Session';
import { hooks } from './session.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    session: SessionService & ServiceAddons<Session>
  }
}

export default function (app: Application): void {
  app.use('/session', new SessionService({}, app));
  app.service('session').hooks(hooks);
}
