import { Hook } from '@feathersjs/feathers';

import { Session } from '../../../entities/Session';

export const createChannel: Hook<Session> = (ctx) => {
  const { uuid } = ctx.result as Session;

  const { connection } = ctx.params;

  if (connection) {
    ctx.app.channel(uuid).join(connection);
  }
};

export const hooks = {
  after: {
    create: [createChannel]
  }
};
