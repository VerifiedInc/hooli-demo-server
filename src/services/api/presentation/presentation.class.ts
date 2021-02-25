import { Params } from '@feathersjs/feathers';
import { NoPresentation, Presentation } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { NoPresentationEntity, NoPresentationEntityOptions } from '../../../entities/NoPresentation';
import { PresentationEntity, PresentationEntityOptions } from '../../../entities/Presentation';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

export interface PresentationResponseDto {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  presentation: Presentation;
  isVerified: boolean;
}

export interface NoPresentationResponseDto {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  noPresentation: NoPresentation;
  isVerified: boolean;
}

export interface PresentationWithVerification {
  presentation: Presentation;
  isVerified: boolean;
}

export interface NoPresentationWithVerification {
  noPresentation: NoPresentation;
  isVerified: boolean;
}

const makePresentationEntityOptionsFromPresentation = (
  { presentation, isVerified }: PresentationWithVerification
): PresentationEntityOptions => {
  const {
    '@context': presentationContext,
    uuid: presentationUuid,
    type: presentationType,
    verifiableCredential: presentationVerifiableCredential,
    proof: presentationProof,
    presentationRequestUuid: presentationPresentationRequestUuid
  } = presentation;

  return {
    presentationContext,
    presentationUuid,
    presentationType,
    presentationVerifiableCredential,
    presentationProof,
    presentationPresentationRequestUuid,
    isVerified
  };
};

const makeNoPresentationEntityOptionsFromNoPresentation = (
  { noPresentation, isVerified }: NoPresentationWithVerification
): NoPresentationEntityOptions => {
  const {
    type: npType,
    proof: npProof,
    holder: npHolder,
    presentationRequestUuid: npPresentationRequestUuid
  } = noPresentation;

  return {
    npType,
    npProof,
    npHolder,
    npPresentationRequestUuid,
    isVerified
  };
};

const isPresentationWithVerification = (
  obj: PresentationWithVerification | NoPresentationWithVerification
): obj is PresentationWithVerification => !!(obj as PresentationWithVerification).presentation;

const makePresentationResponseDtoFromEntity = (
  entity: PresentationEntity
): PresentationResponseDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    presentationContext,
    presentationUuid,
    presentationType,
    presentationVerifiableCredential,
    presentationProof,
    presentationPresentationRequestUuid,
    isVerified
  } = entity;

  return {
    uuid,
    createdAt,
    updatedAt,
    presentation: {
      '@context': presentationContext,
      uuid: presentationUuid,
      type: presentationType,
      verifiableCredential: presentationVerifiableCredential,
      proof: presentationProof,
      presentationRequestUuid: presentationPresentationRequestUuid
    },
    isVerified
  };
};

const makeNoPresentationResponseDtoFromEntity = (
  entity: NoPresentationEntity
): NoPresentationResponseDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    npType,
    npProof,
    npHolder,
    npPresentationRequestUuid,
    isVerified
  } = entity;

  return {
    uuid,
    createdAt,
    updatedAt,
    noPresentation: {
      type: npType,
      proof: npProof,
      holder: npHolder,
      presentationRequestUuid: npPresentationRequestUuid
    },
    isVerified
  };
};

export class PresentationService {
  app: Application;
  options: ServiceOptions;
  presentationDataService: MikroOrmService<PresentationEntity>;
  noPresentationDataService: MikroOrmService<NoPresentationEntity>;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.presentationDataService = app.service('presentationData');
    this.noPresentationDataService = app.service('noPresentationData');
  }

  async createPresentationEntity (presentation: PresentationWithVerification, params?: Params): Promise<PresentationEntity> {
    const options = makePresentationEntityOptionsFromPresentation(presentation);
    try {
      return this.presentationDataService.create(options, params);
    } catch (e) {
      logger.error('PresentationService.createPresentationEntity caught an error thrown by PresentationDataService.create', e);
      throw e;
    }
  }

  async createNoPresentationEntity (
    noPresentation: NoPresentationWithVerification,
    params?: Params
  ): Promise<NoPresentationEntity> {
    const options = makeNoPresentationEntityOptionsFromNoPresentation(noPresentation);
    try {
      return this.noPresentationDataService.create(options, params);
    } catch (e) {
      logger.error('PresentationService.crateNoPresentationEntity caught an error thrown by NoPresentationDataService.create', e);
      throw e;
    }
  }

  async create (
    data: PresentationWithVerification | NoPresentationWithVerification,
    params?: Params
  ): Promise<PresentationResponseDto | NoPresentationResponseDto> {
    let response: PresentationResponseDto | NoPresentationResponseDto;
    if (isPresentationWithVerification(data)) {
      try {
        const entity = await this.createPresentationEntity(data, params);
        response = makePresentationResponseDtoFromEntity(entity);
      } catch (e) {
        logger.error('PresentationService.create caught an error thrown by PresentationService.createPresentationEntity', e);
        throw e;
      }
    } else {
      try {
        const entity = await this.createNoPresentationEntity(data, params);
        response = makeNoPresentationResponseDtoFromEntity(entity);
      } catch (e) {
        logger.error('PresentationService.create caught an error thrown by PresentationService.createNoPresentationEntity', e);
        throw e;
      }
    }

    return response;
  }
}
