import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { PresentationServiceV2 } from './presentationV2.class';
import { PresentationEntity } from '../../../entities/Presentation';
import { hooks } from './presentationV2.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    presentationV2: PresentationServiceV2 & ServiceAddons<PresentationEntity>;
  }
}

export default function (app: Application): void {
  app.use('/presentationV2', new PresentationServiceV2({}, app));
  app.service('presentationV2').hooks(hooks);
}
