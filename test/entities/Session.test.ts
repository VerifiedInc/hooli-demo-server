import { wrap, MikroORM } from '@mikro-orm/core';

import { Session } from '../../src/entities/Session';
import mikroOrmConfig from '../../src/mikro-orm.config';
import { resetDb } from '../helpers/resetDb';

describe('Session entity', () => {
  const session = new Session({});

  describe('constructor behavior', () => {
    it('generates a uuid', () => {
      expect(session.uuid).toBeDefined();
    });

    it('generates createdAt and updatedAt dates', () => {
      expect(session.createdAt).toBeDefined();
      expect(session.updatedAt).toBeDefined();
      expect(session.createdAt).toEqual(session.updatedAt);
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

    it('saves the session in the database', async () => {
      await orm.em.persistAndFlush(session);

      // clear the identity map, otherwise MikroORM will return the entity we persisted
      // without making a database call
      orm.em.clear();

      const savedSession = await orm.em.findOneOrFail(Session, session.uuid);
      expect(wrap(savedSession).toPOJO()).toEqual(wrap(session).toPOJO());
    });
  });
});
