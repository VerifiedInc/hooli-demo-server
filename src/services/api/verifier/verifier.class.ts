import { NullableId, Params } from '@feathersjs/feathers';
import { Verifier, VersionInfo } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { VerifierEntity, VerifierEntityOptions } from '../../../entities/Verifier';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions {}

export interface VerifierRequestDto {
  apiKey: string;
  authToken: string;
  encryptionPrivateKey: string;
  signingPrivateKey: string;
  verifier: Verifier
}

export interface VerifierResponseDto extends VerifierRequestDto {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

const makeVerifierEntityOptionsFromRequestDto = (dto: VerifierRequestDto): VerifierEntityOptions => {
  const {
    apiKey,
    authToken,
    encryptionPrivateKey,
    signingPrivateKey,
    verifier: {
      did: verifierDid,
      uuid: verifierUuid,
      createdAt: verifierCreatedAt,
      updatedAt: verifierUpdatedAt,
      name: verifierName,
      customerUuid: verifierCustomerUuid,
      url: verifierUrl,
      isAuthorized: verifierIsAuthorized,
      versionInfo: verifierVersionInfo
    }
  } = dto;
  return {
    apiKey,
    authToken,
    encryptionPrivateKey,
    signingPrivateKey,
    verifierDid,
    verifierUuid,
    verifierCreatedAt: new Date(verifierCreatedAt),
    verifierUpdatedAt: new Date(verifierUpdatedAt),
    verifierName,
    verifierCustomerUuid,
    verifierUrl,
    verifierIsAuthorized,
    verifierVersionInfo: verifierVersionInfo as VersionInfo[]
  };
};

const makeVerifierResponseDtoFromEntity = (entity: VerifierEntity): VerifierResponseDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    apiKey,
    authToken,
    encryptionPrivateKey,
    signingPrivateKey,
    verifierDid,
    verifierUuid,
    verifierCreatedAt,
    verifierUpdatedAt,
    verifierName,
    verifierCustomerUuid,
    verifierUrl,
    verifierIsAuthorized,
    verifierVersionInfo
  } = entity;

  return {
    uuid,
    createdAt,
    updatedAt,
    apiKey,
    authToken,
    encryptionPrivateKey,
    signingPrivateKey,
    verifier: { // attributes from UnumID SaaS
      did: verifierDid,
      uuid: verifierUuid,
      createdAt: verifierCreatedAt.toISOString(),
      updatedAt: verifierUpdatedAt.toISOString(),
      name: verifierName,
      customerUuid: verifierCustomerUuid,
      url: verifierUrl,
      isAuthorized: verifierIsAuthorized,
      versionInfo: verifierVersionInfo,
      apiKey
    }
  };
};

export class VerifierService {
  app: Application;
  options: ServiceOptions;
  dataService: MikroOrmService<VerifierEntity>;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.dataService = app.service('verifierData');
  }

  async create (data: VerifierRequestDto, params?: Params): Promise<VerifierResponseDto> {
    let verifierEntity: VerifierEntity;
    try {
      verifierEntity = await this.dataService.create(makeVerifierEntityOptionsFromRequestDto(data), params);
    } catch (e) {
      logger.error('VerifierService.create caught an error thrown by VerifierDataService.create', e);
      throw e;
    }

    return makeVerifierResponseDtoFromEntity(verifierEntity);
  }

  async get (uuid: NullableId, params?: Params): Promise<VerifierResponseDto> {
    let verifierEntity: VerifierEntity;
    try {
      verifierEntity = await this.dataService.get(uuid, params);
    } catch (e) {
      logger.error('VerifierService.get caught an error thrown by VerifierDataService.get', e);
      throw e;
    }

    return makeVerifierResponseDtoFromEntity(verifierEntity);
  }

  async patch (uuid: NullableId, params: Partial<VerifierEntity>): Promise<VerifierResponseDto> {
    let verifierEntity: VerifierEntity;
    try {
      verifierEntity = await this.dataService.patch(uuid, params);
    } catch (e) {
      logger.error('VerifierService.get caught an error thrown by VerifierDataService.get', e);
      throw e;
    }

    return makeVerifierResponseDtoFromEntity(verifierEntity);
  }
}
