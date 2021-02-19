import { NotFound } from '@feathersjs/errors';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import generateApp from '../../../src/app';
import { Application } from '../../../src/declarations';
import { PresentationRequestEntity } from '../../../src/entities/PresentationRequest';
import { resetDb } from '../../helpers/resetDb';
import { dummyPresentationRequestEntityOptions } from '../../mocks';

describe('VerifierDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('presentationRequestData');
      expect(service).toBeDefined();
    });
  });

  describe('using the service', () => {
    let app: Application;
    let service: MikroOrmService<PresentationRequestEntity>;

    beforeEach(async () => {
      app = await generateApp();
      service = app.service('presentationRequestData');
    });

    afterEach(async () => {
      const orm = app.get('orm');
      orm.em.clear();
      await resetDb(orm);
    });

    describe('create', () => {
      it('saves a PresentationRequestEntity in the database', async () => {
        const savedPresentationRequestEntity = await service.create(dummyPresentationRequestEntityOptions);
        const retrievedPresentationRequestEntity = await service.get(savedPresentationRequestEntity.uuid);
        expect(retrievedPresentationRequestEntity).toEqual(savedPresentationRequestEntity);
      });
    });

    describe('get', () => {
      it('gets a PresentationRequestEntity from the database', async () => {
        const savedPresentationRequestEntity = await service.create(dummyPresentationRequestEntityOptions);
        const retrievedPresentationRequestEntity = await service.get(savedPresentationRequestEntity.uuid);
        expect(retrievedPresentationRequestEntity).toEqual(savedPresentationRequestEntity);
      });
    });

    describe('find', () => {
      let savedPresentationRequestEntity1: PresentationRequestEntity;
      let savedPresentationRequestEntity2: PresentationRequestEntity;

      beforeEach(async () => {
        savedPresentationRequestEntity1 = await service.create(dummyPresentationRequestEntityOptions);
        savedPresentationRequestEntity2 = await service.create(dummyPresentationRequestEntityOptions);
      });

      it('gets all PresentationRequestEntities from the database', async () => {
        const retrievedPresentationRequestEntities = await service.find();
        expect(retrievedPresentationRequestEntities).toEqual([savedPresentationRequestEntity1, savedPresentationRequestEntity2]);
      });
    });

    describe('remove', () => {
      let savedPresentationRequestEntity: PresentationRequestEntity;

      beforeEach(async () => {
        savedPresentationRequestEntity = await service.create(dummyPresentationRequestEntityOptions);
      });

      it('deletes a PresentationRequestEntity from the database', async () => {
        await service.remove(savedPresentationRequestEntity.uuid);
        try {
          await service.get(savedPresentationRequestEntity.uuid);
          fail();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
        }
      });
    });
  });
});
