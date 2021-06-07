import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';
import logger from './logger';

// Creating the presentation websocket publisher for the client to conusme.
export const presentationPublisher = (app: Application) => async (data: any, hook: HookContext) => {
  const prUuid = data.presentation?.presentationRequestUuid || data.noPresentation?.presentationRequestUuid;
  logger.debug(`in presentation websocket publisher grabbing session metadata via presentation request ${prUuid}`);

  const presentationRequest = await app.service('presentationRequestData').get(null, { where: { prUuid } });
  if (presentationRequest && presentationRequest.prMetadata && presentationRequest.prMetadata.fields) {
    // tells the socket handler which persisted connection to response to
    return app.channel(presentationRequest.prMetadata.fields.sessionUuid);
  }
};
export default function (app: Application): void {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', (connection: any): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  app.service('presentationWebsocket').publish(presentationPublisher(app));
}
