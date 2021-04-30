import { Entity, Property } from '@mikro-orm/core';
import { Proof, Credential } from '@unumid/types';

import { BaseEntity, BaseEntityOptions } from './BaseEntity';

export interface PresentationEntityOptions extends BaseEntityOptions {
  presentationContext: ['https://www.w3.org/2018/credentials/v1', ...string[]];
  presentationType: ['VerifiablePresentation', ...string[]];
  presentationVerifiableCredentials: Credential[];
  presentationProof: Proof;
  presentationPresentationRequestUuid: string;
  isVerified: boolean;
  verifierDid: string;
}

@Entity({ tableName: 'Presentation' })
export class PresentationEntity extends BaseEntity {
  @Property()
  presentationContext: ['https://www.w3.org/2018/credentials/v1', ...string[]];

  @Property()
  presentationType: ['VerifiablePresentation', ...string[]];

  @Property()
  presentationVerifiableCredentials: Credential[];

  @Property()
  presentationProof: Proof;

  @Property()
  presentationPresentationRequestUuid: string;

  @Property()
  isVerified: boolean;

  @Property()
  verifierDid: string;

  constructor (options: PresentationEntityOptions) {
    super(options);

    const {
      presentationContext,
      presentationType,
      presentationVerifiableCredentials,
      presentationProof,
      presentationPresentationRequestUuid,
      isVerified,
      verifierDid
    } = options;

    this.presentationContext = presentationContext;
    this.presentationType = presentationType;
    this.presentationVerifiableCredentials = presentationVerifiableCredentials;
    this.presentationProof = presentationProof;
    this.presentationPresentationRequestUuid = presentationPresentationRequestUuid;
    this.isVerified = isVerified;
    this.verifierDid = verifierDid;
  }
}
