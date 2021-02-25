import { NotFound } from '@feathersjs/errors';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import generateApp from '../../../src/app';
import { Application } from '../../../src/declarations';
import { NoPresentationEntity } from '../../../src/entities/NoPresentation';
import { resetDb } from '../../helpers/resetDb';
import { dummyNoPresentationEntityOptions } from '../../mocks';

describe('PresentationDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('noPresentationData');
      expect(service).toBeDefined();
    });
  });

  describe('using the service', () => {
    let app: Application;
    let service: MikroOrmService<NoPresentationEntity>;

    beforeEach(async () => {
      app = await generateApp();
      service = app.service('noPresentationData');
    });

    afterEach(async () => {
      const orm = app.get('orm');
      orm.em.clear();
      await resetDb(orm);
    });

    describe('create', () => {
      it('saves a NoPresentationEntity in the database', async () => {
        const savedNoPresentationEntity = await service.create(dummyNoPresentationEntityOptions);
        const retrievedNoPresentationEntity = await service.get(savedNoPresentationEntity.uuid);
        expect(retrievedNoPresentationEntity).toEqual(savedNoPresentationEntity);
      });
    });

    describe('get', () => {
      it('gets a NoPresentationEntity from the database', async () => {
        const savedNoPresentationEntity = await service.create(dummyNoPresentationEntityOptions);
        const retrievedNoPresentationEntity = await service.get(savedNoPresentationEntity.uuid);
        expect(retrievedNoPresentationEntity).toEqual(savedNoPresentationEntity);
      });
    });

    describe('find', () => {
      let savedNoPresentationEntity1: NoPresentationEntity;
      let savedNoPresentationEntity2: NoPresentationEntity;

      beforeEach(async () => {
        savedNoPresentationEntity1 = await service.create(dummyNoPresentationEntityOptions);
        savedNoPresentationEntity2 = await service.create(dummyNoPresentationEntityOptions);
      });

      it('gets all NoPresentationEntities from the database', async () => {
        const retrievedNoPresentationEntities = await service.find();
        expect(retrievedNoPresentationEntities).toEqual([savedNoPresentationEntity1, savedNoPresentationEntity2]);
      });
    });

    describe('remove', () => {
      let savedNoPresentationEntity: NoPresentationEntity;

      beforeEach(async () => {
        savedNoPresentationEntity = await service.create(dummyNoPresentationEntityOptions);
      });

      it('deletes a NoPresentationEntity from the database', async () => {
        await service.remove(savedNoPresentationEntity.uuid);
        try {
          await service.get(savedNoPresentationEntity.uuid);
          fail();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
        }
      });
    });
  });
});
