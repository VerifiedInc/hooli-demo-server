import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { PresentationService } from './presentation.class';
import { PresentationEntity } from '../../../entities/Presentation';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    presentationWebsocket: PresentationService & ServiceAddons<PresentationEntity>;
  }
}

export default function (app: Application): void {
  app.use('/presentationWebsocket', new PresentationService({}, app));
}
