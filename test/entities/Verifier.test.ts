import { wrap, MikroORM } from '@mikro-orm/core';

import { VerifierEntity } from '../../src/entities/Verifier';
import mikroOrmConfig from '../../src/mikro-orm.config';
import { resetDb } from '../helpers/resetDb';
import { dummyVerifierEntityOptions } from '../mocks';

describe('VerifierEntity', () => {
  const verifierEntity = new VerifierEntity(dummyVerifierEntityOptions);

  describe('constructor behavior', () => {
    it('generates a uuid', () => {
      expect(verifierEntity.uuid).toBeDefined();
    });

    it('generates createdAt and updatedAt dates', () => {
      expect(verifierEntity.createdAt).toBeDefined();
      expect(verifierEntity.updatedAt).toBeDefined();
      expect(verifierEntity.createdAt).toEqual(verifierEntity.updatedAt);
    });

    it('sets the apiKey, authToken, and private keys', () => {
      expect(verifierEntity.apiKey).toEqual(dummyVerifierEntityOptions.apiKey);
      expect(verifierEntity.authToken).toEqual(dummyVerifierEntityOptions.authToken);
      expect(verifierEntity.encryptionPrivateKey).toEqual(dummyVerifierEntityOptions.encryptionPrivateKey);
      expect(verifierEntity.signingPrivateKey).toEqual(dummyVerifierEntityOptions.signingPrivateKey);
    });

    it('sets the verifier data from options', () => {
      expect(verifierEntity.verifierDid).toEqual(dummyVerifierEntityOptions.verifierDid);
      expect(verifierEntity.verifierUuid).toEqual(dummyVerifierEntityOptions.verifierUuid);
      expect(verifierEntity.verifierCreatedAt).toEqual(dummyVerifierEntityOptions.verifierCreatedAt);
      expect(verifierEntity.verifierUpdatedAt).toEqual(dummyVerifierEntityOptions.verifierUpdatedAt);
      expect(verifierEntity.verifierName).toEqual(dummyVerifierEntityOptions.verifierName);
      expect(verifierEntity.verifierCustomerUuid).toEqual(dummyVerifierEntityOptions.verifierCustomerUuid);
      expect(verifierEntity.verifierUrl).toEqual(dummyVerifierEntityOptions.verifierUrl);
      expect(verifierEntity.verifierIsAuthorized).toEqual(dummyVerifierEntityOptions.verifierIsAuthorized);
    });
  });

  describe('storage behavior', () => {
    let orm: MikroORM;

    beforeEach(async () => {
      orm = await MikroORM.init(mikroOrmConfig);
    });

    afterEach(async () => {
      await resetDb(orm);
    });

    it('saves the VerifierEntity in the database', async () => {
      await orm.em.persistAndFlush(verifierEntity);

      // clear the identity map, otherwise MikroORM will return the entity we persisted
      // without making a database call
      orm.em.clear();

      const savedVerifierEntity = await orm.em.findOneOrFail(VerifierEntity, verifierEntity.uuid);
      expect(wrap(savedVerifierEntity).toPOJO()).toEqual(wrap(verifierEntity).toPOJO());
    });
  });
});
