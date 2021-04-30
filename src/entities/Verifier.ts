import { Entity, Property } from '@mikro-orm/core';
import { VersionInfo } from '@unumid/types';

import { BaseEntity, BaseEntityOptions } from './BaseEntity';

export interface VerifierEntityOptions extends BaseEntityOptions {
  apiKey: string;
  authToken: string;
  encryptionPrivateKey: string;
  signingPrivateKey: string;
  verifierDid: string;
  verifierUuid: string;
  verifierCreatedAt: Date;
  verifierUpdatedAt: Date;
  verifierName: string;
  verifierCustomerUuid: string;
  verifierUrl: string;
  verifierIsAuthorized: boolean;
  verifierVersionInfo: VersionInfo[];
}

@Entity({ tableName: 'Verifier' })
export class VerifierEntity extends BaseEntity {
  @Property()
  apiKey: string;

  @Property({ columnType: 'text' })
  authToken: string;

  @Property({ columnType: 'text' })
  encryptionPrivateKey: string;

  @Property({ columnType: 'text' })
  signingPrivateKey: string;

  @Property()
  verifierDid: string;

  @Property()
  verifierUuid: string;

  @Property({ columnType: 'timestamptz(6)' })
  verifierCreatedAt: Date;

  @Property({ columnType: 'timestamptz(6)' })
  verifierUpdatedAt: Date;

  @Property()
  verifierName: string;

  @Property()
  verifierCustomerUuid: string;

  @Property()
  verifierUrl: string;

  @Property()
  verifierIsAuthorized: boolean;

  @Property()
  verifierVersionInfo: VersionInfo[];

  constructor (options: VerifierEntityOptions) {
    super(options);
    const {
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
    } = options;

    this.apiKey = apiKey;
    this.authToken = authToken;
    this.encryptionPrivateKey = encryptionPrivateKey;
    this.signingPrivateKey = signingPrivateKey;
    this.verifierDid = verifierDid;
    this.verifierUuid = verifierUuid;
    this.verifierCreatedAt = verifierCreatedAt;
    this.verifierUpdatedAt = verifierUpdatedAt;
    this.verifierName = verifierName;
    this.verifierCustomerUuid = verifierCustomerUuid;
    this.verifierUrl = verifierUrl;
    this.verifierIsAuthorized = verifierIsAuthorized;
    this.verifierVersionInfo = verifierVersionInfo;
  }
}
