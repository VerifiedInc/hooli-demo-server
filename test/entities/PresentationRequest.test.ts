import { wrap, MikroORM } from '@mikro-orm/core';

import { PresentationRequestEntity } from '../../src/entities/PresentationRequest';
import mikroOrmConfig from '../../src/mikro-orm.config';
import { resetDb } from '../helpers/resetDb';
import { dummyPresentationRequestEntityOptions } from '../mocks';

describe('PresentationRequestEntity', () => {
  const presentationRequestEntity = new PresentationRequestEntity(dummyPresentationRequestEntityOptions);

  describe('constructor behavior', () => {
    it('generates a uuid', () => {
      expect(presentationRequestEntity.uuid).toBeDefined();
    });

    it('generates createdAt and updatedAt dates', () => {
      expect(presentationRequestEntity.createdAt).toBeDefined();
      expect(presentationRequestEntity.updatedAt).toBeDefined();
      expect(presentationRequestEntity.createdAt).toEqual(presentationRequestEntity.updatedAt);
    });

    it('sets the PresentationRequest data from options', () => {
      expect(presentationRequestEntity.prUuid).toEqual(dummyPresentationRequestEntityOptions.prUuid);
      expect(presentationRequestEntity.prCreatedAt).toEqual(dummyPresentationRequestEntityOptions.prCreatedAt);
      expect(presentationRequestEntity.prUpdatedAt).toEqual(dummyPresentationRequestEntityOptions.prUpdatedAt);
      expect(presentationRequestEntity.prExpiresAt).toEqual(dummyPresentationRequestEntityOptions.prExpiresAt);
      expect(presentationRequestEntity.prVerifier).toEqual(dummyPresentationRequestEntityOptions.prVerifier);
      expect(presentationRequestEntity.prCredentialRequests).toEqual(dummyPresentationRequestEntityOptions.prCredentialRequests);
      expect(presentationRequestEntity.prProof).toEqual(dummyPresentationRequestEntityOptions.prProof);
      expect(presentationRequestEntity.prMetadata).toEqual(dummyPresentationRequestEntityOptions.prMetadata);
      expect(presentationRequestEntity.prHolderAppUuid).toEqual(dummyPresentationRequestEntityOptions.prHolderAppUuid);
      expect(presentationRequestEntity.prVerifierInfo).toEqual(dummyPresentationRequestEntityOptions.prVerifierInfo);
      expect(presentationRequestEntity.prIssuerInfo).toEqual(dummyPresentationRequestEntityOptions.prIssuerInfo);
      expect(presentationRequestEntity.prDeeplink).toEqual(dummyPresentationRequestEntityOptions.prDeeplink);
      expect(presentationRequestEntity.prQrCode).toEqual(dummyPresentationRequestEntityOptions.prQrCode);
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

    it('saves the presentationRequestEntity in the database', async () => {
      await orm.em.persistAndFlush(presentationRequestEntity);

      // clear the identity map, otherwise MikroORM will return the entity we persisted
      // without making a database call
      orm.em.clear();

      const savedPresentationRequestEntity = await orm.em.findOneOrFail(PresentationRequestEntity, presentationRequestEntity.uuid);
      expect(wrap(savedPresentationRequestEntity).toPOJO()).toEqual(wrap(presentationRequestEntity).toPOJO());
    });
  });
});
