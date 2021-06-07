import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { PresentationServiceV3 } from './presentationV3.class';
import { PresentationEntity } from '../../../entities/Presentation';
import { hooks } from './presentationV3.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    presentationV3: PresentationServiceV3 & ServiceAddons<PresentationEntity>;
  }
}

export default function (app: Application): void {
  app.use('/presentationV3', new PresentationServiceV3({}, app));
  app.service('presentationV3').hooks(hooks);
}
