import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Presentation as PresentationDeprecated, NoPresentation as NoPresentationDeprecated } from '@unumid/types-deprecated';
import { Presentation, EncryptedPresentation } from '@unumid/types';
import { WithVersion } from '@unumid/demo-types';
import { valid } from 'semver';

export const validateData: Hook<WithVersion<EncryptedPresentation>> = (ctx) => {
  const { data, params } = ctx;
  if (!data) {
    throw new BadRequest('data is required.');
  }

  if (!data.presentationRequestInfo) {
    throw new BadRequest('presentationRequestInfo is required.');
  }

  if (!data.encryptedPresentation) {
    throw new BadRequest('encryptedPresentation is required.');
  }

  if (!params.headers || !params.headers.version) {
    throw new BadRequest('version header is required.');
  }

  if (!valid(params.headers.version)) {
    throw new BadRequest('version header must be in valid semver notation.');
  }

  data.version = params.headers.version;

  params.isValidated = true;
};

// export const checkVersion: Hook<WithVersion<EncryptedPresentation>> = (ctx) => {
//   const { params, data } = ctx;
//   if (!params.headers || !params.headers.version) {
//     throw new BadRequest('version header is required.');
//   }

//   data?.version = ;

//   ctx.params.isValidated = true;
// };

export interface DataWithVerification {
  presentation: Presentation | PresentationDeprecated | NoPresentationDeprecated;
  isVerified: boolean;
}

export const hooks = {
  before: {
    create: [validateData]
  }
};
