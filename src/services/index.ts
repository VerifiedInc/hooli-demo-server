import { Application } from '../declarations';
import sessionData from './data/session.data.service';
import verifierData from './data/verifier.data.service';
import presentationRequestData from './data/presentationRequest.data.service';

export default function (app: Application): void {
  app.configure(sessionData);
  app.configure(verifierData);
  app.configure(presentationRequestData);
}
