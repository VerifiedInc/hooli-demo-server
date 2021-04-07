import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Presentation, NoPresentation, EncryptedPresentation } from '@unumid/types';

export const validateData: Hook<EncryptedPresentation> = (ctx) => {
  const { data } = ctx;
  if (!data) {
    throw new BadRequest('data is required.');
  }

  if (!data.presentationRequestInfo) {
    throw new BadRequest('presentationRequestInfo is required.');
  }

  if (!data.encryptedPresentation) {
    throw new BadRequest('encryptedPresentation is required.');
  }

  ctx.params.isValidated = true;
};

export interface DataWithVerification {
  presentation: Presentation | NoPresentation;
  isVerified: boolean;
}

export const hooks = {
  before: {
    create: [validateData]
  }
};
