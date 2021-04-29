import { Params } from '@feathersjs/feathers';
import { EncryptedPresentation, Presentation, PresentationReceiptInfo, VerificationResponse } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { NoPresentationEntity } from '../../../entities/NoPresentation';
import { PresentationEntity } from '../../../entities/Presentation';
import { DemoNoPresentationDto as DemoNoPresentationDtoDeprecated, DemoPresentationDto as DemoPresentationDtoDeprecated } from '@unumid/demo-types-deprecated';
import { DemoPresentationDto, WithVersion } from '@unumid/demo-types';
import { lt } from 'semver';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

const makeDemoPresentationDtoFromEntity = (entity: WithVersion<PresentationEntity>): DemoPresentationDto | DemoPresentationDtoDeprecated => {
  const {
    uuid,
    createdAt,
    updatedAt,
    presentationContext,
    presentationType,
    presentationVerifiableCredentials,
    presentationProof,
    presentationPresentationRequestUuid,
    isVerified,
    verifierDid
  } = entity;

  if (lt(entity.version, '2.0.0')) {
    return {
      uuid,
      createdAt,
      updatedAt,
      presentation: {
        '@context': presentationContext,
        uuid,
        type: presentationType,
        verifiableCredentials: presentationVerifiableCredentials,
        verifierDid,
        proof: presentationProof,
        presentationRequestUuid: presentationPresentationRequestUuid
      },
      isVerified
    };
  }

  return {
    uuid,
    createdAt,
    updatedAt,
    presentation: {
      '@context': presentationContext,
      uuid,
      type: presentationType,
      verifiableCredential: presentationVerifiableCredentials,
      verifierDid,
      proof: presentationProof,
      presentationRequestUuid: presentationPresentationRequestUuid
    },
    isVerified
  };
};

const makeDemoNoPresentationDtoFromEntity = (entity: NoPresentationEntity): DemoNoPresentationDtoDeprecated => {
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
      data: WithVersion<PresentationEntity> | NoPresentationEntity,
      params?: Params
    ): Promise<DemoPresentationDto | DemoNoPresentationDtoDeprecated | DemoPresentationDtoDeprecated> { // TODO remove the deprecated types
      let response: DemoPresentationDto | DemoNoPresentationDtoDeprecated | DemoPresentationDtoDeprecated;

      // checking wether we are dealing with a Presentation or NoPresentation entity
      if ((data as PresentationEntity).presentationType && (data as PresentationEntity).presentationType.includes('VerifiablePresentation')) {
        // TODO: need to check what pres type it is then do one dep demo dto and one not dep demo dto.
        response = makeDemoPresentationDtoFromEntity(data as WithVersion<PresentationEntity>);
      } else {
        response = makeDemoNoPresentationDtoFromEntity(data as NoPresentationEntity);
      }

      return response;
    }
}
