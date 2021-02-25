import { NotFound } from '@feathersjs/errors';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import generateApp from '../../../src/app';
import { Application } from '../../../src/declarations';
import { PresentationEntity } from '../../../src/entities/Presentation';
import { resetDb } from '../../helpers/resetDb';
import { dummyPresentationEntityOptions } from '../../mocks';

describe('PresentationDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('presentationData');
      expect(service).toBeDefined();
    });
  });

  describe('using the service', () => {
    let app: Application;
    let service: MikroOrmService<PresentationEntity>;

    beforeEach(async () => {
      app = await generateApp();
      service = app.service('presentationData');
    });

    afterEach(async () => {
      const orm = app.get('orm');
      orm.em.clear();
      await resetDb(orm);
    });

    describe('create', () => {
      it('saves a PresentationEntity in the database', async () => {
        const savedPresentationEntity = await service.create(dummyPresentationEntityOptions);
        const retrievedPresentationEntity = await service.get(savedPresentationEntity.uuid);
        expect(retrievedPresentationEntity).toEqual(savedPresentationEntity);
      });
    });

    describe('get', () => {
      it('gets a PresentationEntity from the database', async () => {
        const savedPresentationEntity = await service.create(dummyPresentationEntityOptions);
        const retrievedPresentationEntity = await service.get(savedPresentationEntity.uuid);
        expect(retrievedPresentationEntity).toEqual(savedPresentationEntity);
      });
    });

    describe('find', () => {
      let savedPresentationEntity1: PresentationEntity;
      let savedPresentationEntity2: PresentationEntity;

      beforeEach(async () => {
        savedPresentationEntity1 = await service.create(dummyPresentationEntityOptions);
        savedPresentationEntity2 = await service.create(dummyPresentationEntityOptions);
      });

      it('gets all PresentationEntities from the database', async () => {
        const retrievedPresentationEntities = await service.find();
        expect(retrievedPresentationEntities).toEqual([savedPresentationEntity1, savedPresentationEntity2]);
      });
    });

    describe('remove', () => {
      let savedPresentationEntity: PresentationEntity;

      beforeEach(async () => {
        savedPresentationEntity = await service.create(dummyPresentationEntityOptions);
      });

      it('deletes a PresentationEntity from the database', async () => {
        await service.remove(savedPresentationEntity.uuid);
        try {
          await service.get(savedPresentationEntity.uuid);
          fail();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
        }
      });
    });
  });
});
