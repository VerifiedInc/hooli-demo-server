import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { PresentationService } from './presentation.class';
import { PresentationEntity } from '../../../entities/Presentation';
import { hooks } from './presentation.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    presentation: PresentationService & ServiceAddons<PresentationEntity>;
  }
}

export default function (app: Application): void {
  app.use('/presentation', new PresentationService({}, app));
  app.service('presentation').hooks(hooks);
}
