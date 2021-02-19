import createService, { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { Session } from '../../entities/Session';

declare module '../../declarations' {
  interface ServiceTypes {
    sessionData: MikroOrmService<Session> & ServiceAddons<Session>;
  }
}

export default function (app: Application): void {
  const sessionDataService = createService({
    Entity: Session,
    orm: app.get('orm')
  });
  app.use('/sessionData', sessionDataService);
}
