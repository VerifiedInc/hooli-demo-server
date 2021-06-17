import { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PresentationRequestEntity } from '../../entities/PresentationRequest';

export class PresentationRequestDataService extends MikroOrmService<PresentationRequestEntity> {}

declare module '../../declarations' {
  interface ServiceTypes {
    presentationRequestData: PresentationRequestDataService & ServiceAddons<PresentationRequestEntity>;
  }
}

export default function (app: Application): void {
  const presentationRequestDataService = new PresentationRequestDataService({
    Entity: PresentationRequestEntity,
    orm: app.get('orm')
  });
  app.use('/presentationRequestData', presentationRequestDataService);
}
