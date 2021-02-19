import { Service as MikroOrmService } from 'feathers-mikro-orm';

import generateApp from '../../../src/app';
import { Application } from '../../../src/declarations';
import { Session } from '../../../src/entities/Session';
import { resetDb } from '../../helpers/resetDb';

describe('SessionDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('sessionData');
      expect(service).toBeDefined();
    });
  });

  describe('using the service', () => {
    let app: Application;
    let service: MikroOrmService<Session>;

    beforeEach(async () => {
      app = await generateApp();
      service = app.service('sessionData');
    });

    afterEach(async () => {
      const orm = app.get('orm');
      orm.em.clear();
      await resetDb(orm);
    });

    describe('create', () => {
      it('saves a session in the database', async () => {
        const savedSession = await service.create({});
        const retrievedSession = await service.get(savedSession.uuid);
        expect(retrievedSession).toEqual(savedSession);
      });
    });

    describe('get', () => {
      it('gets a session from the database', async () => {
        const savedSession = await service.create({});
        const retrievedSession = await service.get(savedSession.uuid);
        expect(retrievedSession).toEqual(savedSession);
      });
    });
  });
});
