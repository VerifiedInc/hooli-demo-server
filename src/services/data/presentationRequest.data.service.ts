import createService, { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PresentationRequestEntity } from '../../entities/PresentationRequest';

declare module '../../declarations' {
  interface ServiceTypes {
    presentationRequestData: MikroOrmService<PresentationRequestEntity> & ServiceAddons<PresentationRequestEntity>;
  }
}

export default function (app: Application): void {
  const presentationRequestDataService = createService({
    Entity: PresentationRequestEntity,
    orm: app.get('orm')
  });
  app.use('/presentationRequestData', presentationRequestDataService);
}
