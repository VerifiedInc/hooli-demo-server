import { NullableId, Params } from '@feathersjs/feathers';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { Session } from '../../../entities/Session';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions {}

export class SessionService {
  app: Application;
  options: ServiceOptions;
  dataService: MikroOrmService<Session>

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.dataService = app.service('sessionData');
  }

  async create (data: Partial<Session>, params?: Params): Promise<Session> {
    try {
      const createdSession = await this.dataService.create(data, params);
      return createdSession;
    } catch (e) {
      logger.error('SessionService.create caught an error thrown by SessionDataService.create', e);
      throw e;
    }
  }

  async get (uuid: NullableId, params?: Params): Promise<Session> {
    try {
      const session = await this.dataService.get(uuid, params);
      return session;
    } catch (e) {
      logger.error('SessionService.get caught an error thrown by SessionDataService.get', e);
      throw e;
    }
  }

  async remove (uuid: NullableId, params?: Params): Promise<Session> {
    try {
      const removedSession = await this.dataService.remove(uuid, params);
      return removedSession;
    } catch (e) {
      logger.error('SessionService.remove caught an error thrown by SessionDataService.remove', e);
      throw e;
    }
  }
}
