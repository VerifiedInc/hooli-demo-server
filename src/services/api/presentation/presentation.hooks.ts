import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { EncryptedPresentation, Presentation as PresentationDeprecated, NoPresentation as NoPresentationDeprecated } from '@unumid/types-deprecated';
import { WithVersion } from '@unumid/demo-types';
import { valid } from 'semver';
import logger from '../../../logger';

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
  logger.info(`Presentation request made with version header ${data.version}`);

  params.isValidated = true;
};

export interface DataWithVerification {
  presentation: PresentationDeprecated | NoPresentationDeprecated;
  isVerified: boolean;
}

export const hooks = {
  before: {
    create: [validateData]
  }
};
