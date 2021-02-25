import { Entity, Property } from '@mikro-orm/core';
import { Proof } from '@unumid/types';

import { BaseEntity, BaseEntityOptions } from './BaseEntity';

export interface NoPresentationEntityOptions extends BaseEntityOptions {
  npType: ['NoPresentation', ...string[]];
  npProof: Proof;
  npHolder: string;
  npPresentationRequestUuid: string;
  isVerified: boolean;
}

@Entity({ tableName: 'NoPresentation' })
export class NoPresentationEntity extends BaseEntity {
  @Property()
  npType: ['NoPresentation', ...string[]];

  @Property()
  npProof: Proof;

  @Property()
  npHolder: string;

  @Property()
  npPresentationRequestUuid: string;

  @Property()
  isVerified: boolean;

  constructor (options: NoPresentationEntityOptions) {
    super(options);

    const {
      npType,
      npProof,
      npHolder,
      npPresentationRequestUuid,
      isVerified
    } = options;

    this.npType = npType;
    this.npProof = npProof;
    this.npHolder = npHolder;
    this.npPresentationRequestUuid = npPresentationRequestUuid;
    this.isVerified = isVerified;
  }
}
