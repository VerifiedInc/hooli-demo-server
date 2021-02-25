import createService, { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PresentationEntity } from '../../entities/Presentation';

declare module '../../declarations' {
  interface ServiceTypes {
    presentationData: MikroOrmService<PresentationEntity> & ServiceAddons<PresentationEntity>;
  }
}

export default function (app: Application): void {
  const presentationDataService = createService({
    Entity: PresentationEntity,
    orm: app.get('orm')
  });
  app.use('/presentationData', presentationDataService);
}
