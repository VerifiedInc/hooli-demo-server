import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { VerifierService } from './verifier.class';
import { VerifierEntity } from '../../../entities/Verifier';
import { hooks } from './verifier.hooks';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    verifier: VerifierService & ServiceAddons<VerifierEntity>
  }
}

export default function (app: Application): void {
  app.use('/verifier', new VerifierService({}, app));
  app.service('verifier').hooks(hooks);
}
