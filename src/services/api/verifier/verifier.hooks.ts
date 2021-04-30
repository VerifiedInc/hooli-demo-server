import { Hook } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { registerVerifier } from '@unumid/server-sdk';

import { VerifierRequestDto } from './verifier.class';
import logger from '../../../logger';
import { Verifier, VersionInfo } from '@unumid/types';

interface VerifierCreateOptions {
  apiKey: string;
  customerUuid: string;
  name: string;
  url: string;
  versionInfo: VersionInfo[];
}

export const validateVerifierCreateOptions: Hook<VerifierCreateOptions> = (ctx) => {
  const { data } = ctx;

  if (!data) {
    throw new BadRequest('data is required.');
  }

  const { apiKey, customerUuid, name, url, versionInfo } = data;

  if (!apiKey) {
    throw new BadRequest('apiKey is required.');
  }

  if (!customerUuid) {
    throw new BadRequest('customerUuid is required.');
  }

  if (!name) {
    throw new BadRequest('name is required.');
  }

  if (!url) {
    throw new BadRequest('url is required.');
  }

  if (!versionInfo) {
    throw new BadRequest('versionInfo is required.');
  }

  ctx.params.isValidated = true;
};

type RegisterVerifierData = VerifierCreateOptions | VerifierRequestDto;

const isVerifierCreateOptions = (obj: any): obj is VerifierCreateOptions =>
  obj && !!(obj.apiKey && obj.customerUuid && obj.name && obj.url);

export const registerVerifierHook: Hook<RegisterVerifierData> = async (ctx) => {
  if (!isVerifierCreateOptions(ctx.data)) {
    throw new BadRequest();
  }

  if (!ctx.params.isValidated) {
    throw new GeneralError('Hook context has not been validated. Did you forget to run the validateVerifierCreateOptions hook before this one?');
  }

  const { apiKey, customerUuid, name, url, versionInfo } = ctx.data;

  let response;

  try {
    response = await registerVerifier(name, customerUuid, url, apiKey, versionInfo);
  } catch (e) {
    logger.error('registerVerifierHook caught an error thrown by the server sdk', e);
    throw new GeneralError('Error registering verifier.');
  }

  const { body, authToken } = response;

  const {
    uuid,
    did,
    createdAt,
    updatedAt,
    isAuthorized,
    keys
  } = body;

  const verifier: Verifier = {
    uuid,
    did,
    // these are typed as Dates in the return type of registerVerifier,
    // but at runtime they are in fact strings
    // see https://trello.com/c/SADQCGWa/1154-registerverifier-return-type-is-incorrect
    createdAt: createdAt as unknown as string,
    updatedAt: updatedAt as unknown as string,
    isAuthorized,
    name,
    customerUuid,
    url,
    versionInfo
  };

  const newData: VerifierRequestDto = {
    apiKey,
    authToken,
    encryptionPrivateKey: keys.encryption.privateKey,
    signingPrivateKey: keys.signing.privateKey,
    verifier
  };

  ctx.data = newData;
};

export const hooks = {
  before: {
    create: [validateVerifierCreateOptions, registerVerifierHook]
  }
};
