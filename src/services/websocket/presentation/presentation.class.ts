import { Params } from '@feathersjs/feathers';
import { EncryptedPresentation, NoPresentation, Presentation, PresentationReceiptInfo } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { NoPresentationEntity, NoPresentationEntityOptions } from '../../../entities/NoPresentation';
import { PresentationEntity, PresentationEntityOptions } from '../../../entities/Presentation';
import logger from '../../../logger';
import { BadRequest, NotFound } from '@feathersjs/errors';
import { PresentationRequestEntity } from '../../../entities/PresentationRequest';
import { CryptoError } from '@unumid/library-crypto';
import { CredentialInfo, DecryptedPresentation, extractCredentialInfo, verifyPresentation } from '@unumid/server-sdk';
import { DemoNoPresentationDto, DemoPresentationDto, VerificationResponse } from '@unumid/demo-types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

const makeDemoPresentationDtoFromEntity = (entity: PresentationEntity): DemoPresentationDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    presentationContext,
    presentationType,
    presentationVerifiableCredentials,
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
      uuid,
      type: presentationType,
      verifiableCredentials: presentationVerifiableCredentials,
      proof: presentationProof,
      presentationRequestUuid: presentationPresentationRequestUuid
    },
    isVerified
  };
};

const makeDemoNoPresentationDtoFromEntity = (entity: NoPresentationEntity): DemoNoPresentationDto => {
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

    async create (
      data: PresentationEntity | NoPresentationEntity,
      params?: Params
    ): Promise<DemoPresentationDto | DemoNoPresentationDto> {
      let response: DemoPresentationDto | DemoNoPresentationDto;

      // checking wether we are dealing with a Presentation or NoPresentation entity
      if ((data as PresentationEntity).presentationType && (data as PresentationEntity).presentationType.includes('VerifiablePresentation')) {
        response = makeDemoPresentationDtoFromEntity(data as PresentationEntity);
      } else {
        response = makeDemoNoPresentationDtoFromEntity(data as NoPresentationEntity);
      }

      return response;
    }
}
