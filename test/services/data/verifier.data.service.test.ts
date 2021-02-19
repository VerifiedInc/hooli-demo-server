import { NotFound } from '@feathersjs/errors';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import generateApp from '../../../src/app';
import { Application } from '../../../src/declarations';
import { VerifierEntity } from '../../../src/entities/Verifier';
import { VerifierDataService } from '../../../src/services/data/verifier.data.service';
import { resetDb } from '../../helpers/resetDb';
import { dummyVerifierEntityOptions } from '../../mocks';

describe('VerifierDataService', () => {
  describe('initializing the service', () => {
    it('registers with the app', async () => {
      const app = await generateApp();
      const service = app.service('verifierData');
      expect(service).toBeDefined();
    });
  });

  describe('using the service', () => {
    let app: Application;
    let service: VerifierDataService;

    beforeEach(async () => {
      app = await generateApp();
      service = app.service('verifierData');
    });

    afterEach(async () => {
      const orm = app.get('orm');
      orm.em.clear();
      await resetDb(orm);
    });

    describe('create', () => {
      it('saves a verifier in the database', async () => {
        const savedVerifier = await service.create(dummyVerifierEntityOptions);
        const retrievedVerifier = await service.get(savedVerifier.uuid);
        expect(retrievedVerifier).toEqual(savedVerifier);
      });
    });

    describe('get', () => {
      it('gets a verifier from the database', async () => {
        const savedVerifier = await service.create(dummyVerifierEntityOptions);
        const retrievedVerifier = await service.get(savedVerifier.uuid);
        expect(retrievedVerifier).toEqual(savedVerifier);
      });
    });

    describe('find', () => {
      let savedVerifier1: VerifierEntity;
      let savedVerifier2: VerifierEntity;

      beforeEach(async () => {
        savedVerifier1 = await service.create(dummyVerifierEntityOptions);
        savedVerifier2 = await service.create(dummyVerifierEntityOptions);
      });

      it('gets all verifiers from the database', async () => {
        const retrievedVerifiers = await service.find();
        expect(retrievedVerifiers).toEqual([savedVerifier1, savedVerifier2]);
      });
    });

    describe('remove', () => {
      let savedVerifier: VerifierEntity;

      beforeEach(async () => {
        savedVerifier = await service.create(dummyVerifierEntityOptions);
      });

      it('deletes a verifier from the database', async () => {
        await service.remove(savedVerifier.uuid);
        try {
          await service.get(savedVerifier.uuid);
          fail();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
        }
      });
    });

    describe('getDefaultVerifierEntity', () => {
      let savedVerifier1: VerifierEntity;

      beforeEach(async () => {
        savedVerifier1 = await service.create(dummyVerifierEntityOptions);
        await service.create(dummyVerifierEntityOptions);
      });

      it('gets the first verifier from the database', async () => {
        const defaultVerifierEntity = await service.getDefaultVerifierEntity();
        expect(defaultVerifierEntity).toEqual(savedVerifier1);
      });
    });
  });
});
