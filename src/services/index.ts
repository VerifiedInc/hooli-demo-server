import { Application } from '../declarations';

// Data services
import sessionData from './data/session.data.service';
import verifierData from './data/verifier.data.service';
import presentationRequestData from './data/presentationRequest.data.service';
import presentationData from './data/presentation.data.service';
import noPresentationData from './data/noPresentation.data.service';

// API services
import session from './api/session/session.service';
import verifier from './api/verifier/verifier.service';
import presentationRequest from './api/presentationRequest/presentationRequest.service';
import presentation from './api/presentation/presentation.service';
import presentationV2 from './api/presentationV2/presentationV2.service';
import email from './api/email/email.service';
import sms from './api/sms/sms.service';

// Websocket services
import presentationWebsocket from './websocket/presentation/presentation.websocket.service';

export default function (app: Application): void {
  app.configure(sessionData);
  app.configure(verifierData);
  app.configure(presentationRequestData);
  app.configure(presentationData);
  app.configure(noPresentationData);
  app.configure(session);
  app.configure(verifier);
  app.configure(presentationRequest);
  app.configure(presentation);
  app.configure(presentationV2);
  app.configure(email);
  app.configure(sms);
  app.configure(presentationWebsocket);
}
