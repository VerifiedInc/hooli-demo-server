import { HookContext } from '@feathersjs/feathers';

import { hooks, createChannel } from '../../../../src/services/api/session/session.hooks';
import { dummySession } from '../../../mocks';

describe('session hooks', () => {
  describe('createChannel', () => {
    it('runs as the first after create hook', () => {
      expect(hooks.after.create[0]).toEqual(createChannel);
    });

    it('creates an joins a new channel for the created session', () => {
      const mockJoin = jest.fn();
      const mockChannel = jest.fn(() => ({ join: mockJoin }));
      const dummyConnection = {};

      const ctx = {
        result: dummySession,
        params: { connection: dummyConnection },
        app: {
          channel: mockChannel
        }
      } as unknown as HookContext;

      createChannel(ctx);

      expect(mockChannel).toBeCalledWith(dummySession.uuid);
      expect(mockJoin).toBeCalledWith(dummyConnection);
    });
  });
});
