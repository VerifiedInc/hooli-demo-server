import { Hook } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { verifyPresentation, verifyNoPresentation } from '@unumid/server-sdk';
import { Presentation, NoPresentation } from '@unumid/types';
import { has } from 'lodash';

import logger from '../../../logger';
import { NoPresentationWithVerification, PresentationWithVerification } from './presentation.class';
import { VerifierDataService } from '../../data/verifier.data.service';

type Data = Presentation | NoPresentation;

export const isPresentation = (obj: Data): obj is Presentation =>
  obj.type[0] === 'VerifiablePresentation';

export const validatePresentation = (data: Presentation): void => {
  const {
    uuid,
    type,
    verifiableCredential,
    proof,
    presentationRequestUuid
  } = data;

  if (!data['@context']) {
    throw new BadRequest('@context is required.');
  }

  if (!uuid) {
    throw new BadRequest('uuid is required.');
  }

  if (!type) {
    throw new BadRequest('type is required.');
  }

  if (!verifiableCredential) {
    throw new BadRequest('verifiableCredential is required.');
  }

  if (!proof) {
    throw new BadRequest('proof is required.');
  }

  if (!presentationRequestUuid) {
    throw new BadRequest('presentationRequestUuid is required.');
  }
};

export const validateNoPresentation = (data: NoPresentation): void => {
  const {
    type,
    proof,
    holder,
    presentationRequestUuid
  } = data;

  if (!type) {
    throw new BadRequest('type is required.');
  }

  if (!proof) {
    throw new BadRequest('proof is required.');
  }

  if (!holder) {
    throw new BadRequest('holder is required.');
  }

  if (!presentationRequestUuid) {
    throw new BadRequest('presentationRequestUuid is required.');
  }
};

export const validateData: Hook<Data> = (ctx) => {
  const { data } = ctx;
  if (!data) {
    throw new BadRequest('data is required.');
  }

  if (!data.type) {
    throw new BadRequest('type is required.');
  }

  if (isPresentation(data)) {
    validatePresentation(data);
  } else {
    validateNoPresentation(data);
  }

  ctx.params.isValidated = true;
};

const updateAuthToken = async (service: VerifierDataService, uuid: string, newToken: string): Promise<void> => {
  try {
    await service.patch(uuid, { authToken: newToken });
  } catch (e) {
    logger.error('updateAuthToken caught an error thrown by VerifierDataService.patch', e);
    throw e;
  }
};

type DataWithVerification = PresentationWithVerification | NoPresentationWithVerification;

const isDataWithVerification = (data: any): data is DataWithVerification =>
  has(data, 'isVerified');

export const verify: Hook<Data | DataWithVerification> = async (ctx) => {
  const { data, params, app } = ctx;

  if (!data) {
    throw new BadRequest();
  }

  if (!params.isValidated) {
    throw new GeneralError('Data has not been validated. Did you forget to run the validateData hook before this one?');
  }

  if (isDataWithVerification(data)) {
    throw new BadRequest();
  }

  const verifierDataService = app.service('verifierData');

  const { uuid, verifierDid, authToken } = await verifierDataService.getDefaultVerifierEntity();

  let response;

  if (isPresentation(data)) {
    try {
      response = await verifyPresentation(authToken, data, verifierDid);
    } catch (e) {
      logger.error('verify caught an error thrown by the server sdk.', e);
      throw new GeneralError('Error verifying presentation.');
    }

    if (response.authToken !== authToken) {
      updateAuthToken(verifierDataService, uuid, response.authToken);
    }

    const dataWithVerification = {
      presentation: data,
      isVerified: response.body.isVerified
    };

    ctx.data = dataWithVerification;
  } else {
    try {
      response = await verifyNoPresentation(authToken, data, verifierDid);
    } catch (e) {
      logger.error('verify caught an error thrown by the server sdk.', e);
      throw new GeneralError('Error verifying noPresentation.');
    }

    if (response.authToken !== authToken) {
      updateAuthToken(verifierDataService, uuid, response.authToken);
    }

    const dataWithVerification = {
      noPresentation: data,
      isVerified: response.body.isVerified
    };

    ctx.data = dataWithVerification;
  }
};

export const hooks = {
  before: {
    create: [validateData, verify]
  }
};
