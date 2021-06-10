import { wrap, MikroORM } from '@mikro-orm/core';

import { PresentationEntity } from '../../src/entities/Presentation';
import mikroOrmConfig from '../../src/mikro-orm.config';
import { resetDb } from '../helpers/resetDb';
import { dummyPresentationEntityOptions } from '../mocks';

describe('PresentationEntity', () => {
  const presentationEntity = new PresentationEntity(dummyPresentationEntityOptions);

  describe('constructor behavior', () => {
    it('generates a uuid', () => {
      expect(presentationEntity.uuid).toBeDefined();
    });

    it('generates createdAt and updatedAt dates', () => {
      expect(presentationEntity.createdAt).toBeDefined();
      expect(presentationEntity.updatedAt).toBeDefined();
      expect(presentationEntity.createdAt).toEqual(presentationEntity.updatedAt);
    });

    it('sets the presentation data from options', () => {
      expect(presentationEntity.presentationContext).toEqual(dummyPresentationEntityOptions.presentationContext);
      expect(presentationEntity.presentationType).toEqual(dummyPresentationEntityOptions.presentationType);
      expect(presentationEntity.presentationVerifiableCredentials).toEqual(dummyPresentationEntityOptions.presentationVerifiableCredentials);
      expect(presentationEntity.presentationProof).toEqual(dummyPresentationEntityOptions.presentationProof);
      expect(presentationEntity.presentationPresentationRequestId).toEqual(dummyPresentationEntityOptions.presentationPresentationRequestId);
    });

    it('sets isVerified from options', () => {
      expect(presentationEntity.isVerified).toEqual(dummyPresentationEntityOptions.isVerified);
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

    it('saves the PresentationEntity in the database', async () => {
      await orm.em.persistAndFlush(presentationEntity);

      // clear the identity map, otherwise MikroORM will return the entity we persisted
      // without making a database call
      orm.em.clear();

      const savedPresentationEntity = await orm.em.findOneOrFail(PresentationEntity, presentationEntity.uuid);
      const expected = {
        ...wrap(savedPresentationEntity).toPOJO(),
        presentationVerifiableCredentials: [{
          ...savedPresentationEntity.presentationVerifiableCredentials[0],
          expirationDate: new Date(savedPresentationEntity.presentationVerifiableCredentials[0].expirationDate),
          issuanceDate: new Date(savedPresentationEntity.presentationVerifiableCredentials[0].issuanceDate)
        }]
      };
      expect(expected).toEqual(wrap(presentationEntity).toPOJO());
    });
  });
});
