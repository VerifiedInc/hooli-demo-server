import createService, { Service as MikroOrmService } from 'feathers-mikro-orm';
import { Params, ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PresentationRequestEntity } from '../../entities/PresentationRequest';
import logger from '../../logger';

export class PresentationRequestDataService extends MikroOrmService<PresentationRequestEntity> {
  async findOne (params?: Params): Promise<PresentationRequestEntity> {
    try {
      const [result] = await this.find(params);
      return result;
    } catch (e) {
      logger.error('PresentationDataService.findOne caught an error thrown by this.findOne', e);
      throw e;
    }
  }
}

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
