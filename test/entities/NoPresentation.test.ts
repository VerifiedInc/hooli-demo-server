import { wrap, MikroORM } from '@mikro-orm/core';

import { NoPresentationEntity } from '../../src/entities/NoPresentation';
import mikroOrmConfig from '../../src/mikro-orm.config';
import { resetDb } from '../helpers/resetDb';
import { dummyNoPresentationEntityOptions } from '../mocks';

describe('NoPresentationEntity', () => {
  const noPresentationEntity = new NoPresentationEntity(dummyNoPresentationEntityOptions);

  describe('constructor behavior', () => {
    it('generates a uuid', () => {
      expect(noPresentationEntity.uuid).toBeDefined();
    });

    it('generates createdAt and updatedAt dates', () => {
      expect(noPresentationEntity.createdAt).toBeDefined();
      expect(noPresentationEntity.updatedAt).toBeDefined();
      expect(noPresentationEntity.createdAt).toEqual(noPresentationEntity.updatedAt);
    });

    it('sets the NoPresentation data from options', () => {
      expect(noPresentationEntity.npHolder).toEqual(dummyNoPresentationEntityOptions.npHolder);
      expect(noPresentationEntity.npPresentationRequestUuid).toEqual(dummyNoPresentationEntityOptions.npPresentationRequestUuid);
      expect(noPresentationEntity.npProof).toEqual(dummyNoPresentationEntityOptions.npProof);
      expect(noPresentationEntity.npType).toEqual(dummyNoPresentationEntityOptions.npType);
    });

    it('sets isVerified from options', () => {
      expect(noPresentationEntity.isVerified).toEqual(dummyNoPresentationEntityOptions.isVerified);
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

    it('saves the NoPresentationEntity in the database', async () => {
      await orm.em.persistAndFlush(noPresentationEntity);

      // clear the identity map, otherwise MikroORM will return the entity we persisted
      // without making a database call
      orm.em.clear();

      const savedNoPresentationEntity = await orm.em.findOneOrFail(NoPresentationEntity, noPresentationEntity.uuid);
      expect(wrap(savedNoPresentationEntity).toPOJO()).toEqual(wrap(noPresentationEntity).toPOJO());
    });
  });
});
