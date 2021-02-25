import createService, { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { NoPresentationEntity } from '../../entities/NoPresentation';

declare module '../../declarations' {
  interface ServiceTypes {
    noPresentationData: MikroOrmService<NoPresentationEntity> & ServiceAddons<NoPresentationEntity>;
  }
}

export default function (app: Application): void {
  const presentationDataService = createService({
    Entity: NoPresentationEntity,
    orm: app.get('orm')
  });
  app.use('/noPresentationData', presentationDataService);
}
