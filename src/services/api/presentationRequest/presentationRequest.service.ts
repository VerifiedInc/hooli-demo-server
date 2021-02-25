import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { PresentationRequestService } from './presentationRequest.class';
import { PresentationRequestEntity } from '../../../entities/PresentationRequest';
import { hooks } from './presentationRequest.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    presentationRequest: PresentationRequestService & ServiceAddons<PresentationRequestEntity>;
  }
}

export default function (app: Application): void {
  app.use('/presentationRequest', new PresentationRequestService({}, app));
  app.service('presentationRequest').hooks(hooks);
}
