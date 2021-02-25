import { NullableId, Params } from '@feathersjs/feathers';
import { PresentationRequestPostDto } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { PresentationRequestEntity, PresentationRequestEntityOptions } from '../../../entities/PresentationRequest';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

export interface PresentationRequestResponseDto {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  presentationRequest: PresentationRequestPostDto;
}

const makePresentationRequestEntityOptionsFromDto = (
  dto: PresentationRequestPostDto
): PresentationRequestEntityOptions => {
  const {
    presentationRequest: {
      uuid: prUuid,
      createdAt: prCreatedAt,
      updatedAt: prUpdatedAt,
      expiresAt: prExpiresAt,
      verifier: prVerifier,
      credentialRequests: prCredentialRequests,
      proof: prProof,
      metadata: prMetadata,
      holderAppUuid: prHolderAppUuid
    },
    verifier: prVerifierInfo,
    issuers: prIssuerInfo,
    deeplink: prDeeplink,
    qrCode: prQrCode
  } = dto;

  return {
    prUuid,
    prCreatedAt,
    prUpdatedAt,
    prExpiresAt,
    prVerifier,
    prCredentialRequests,
    prProof,
    prMetadata,
    prHolderAppUuid,
    prVerifierInfo,
    prIssuerInfo,
    prDeeplink,
    prQrCode
  };
};

const makePresentationRequestResponseDtoFromEntity = (
  entity: PresentationRequestEntity
): PresentationRequestResponseDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    prUuid,
    prCreatedAt,
    prUpdatedAt,
    prExpiresAt,
    prVerifier,
    prCredentialRequests,
    prProof,
    prMetadata,
    prHolderAppUuid,
    prVerifierInfo,
    prIssuerInfo,
    prDeeplink,
    prQrCode
  } = entity;

  return {
    uuid,
    createdAt,
    updatedAt,
    presentationRequest: {
      presentationRequest: {
        uuid: prUuid,
        createdAt: prCreatedAt,
        updatedAt: prUpdatedAt,
        expiresAt: prExpiresAt,
        verifier: prVerifier,
        credentialRequests: prCredentialRequests,
        proof: prProof,
        metadata: prMetadata,
        holderAppUuid: prHolderAppUuid
      },
      verifier: prVerifierInfo,
      issuers: prIssuerInfo,
      deeplink: prDeeplink,
      qrCode: prQrCode
    }
  };
};

export class PresentationRequestService {
  app: Application;
  options: ServiceOptions;
  dataService: MikroOrmService<PresentationRequestEntity>;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.dataService = app.service('presentationRequestData');
  }

  async create (data: PresentationRequestPostDto, params?: Params): Promise<PresentationRequestResponseDto> {
    let entity;
    try {
      entity = await this.dataService.create(makePresentationRequestEntityOptionsFromDto(data), params);
    } catch (e) {
      logger.error('PresentationRequestService.create caught an error thrown by PresentationRequestDataService.create', e);
      throw e;
    }

    return makePresentationRequestResponseDtoFromEntity(entity);
  }

  async get (uuid: NullableId, params?: Params): Promise<PresentationRequestResponseDto> {
    let entity;
    try {
      entity = await this.dataService.get(uuid, params);
    } catch (e) {
      logger.error('PresentationRequestService.get caught an error thrown by PresentationRequestDataService.get', e);
      throw e;
    }

    return makePresentationRequestResponseDtoFromEntity(entity);
  }
}
