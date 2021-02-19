import { Migration } from '@mikro-orm/migrations';

export class Migration20210219004651 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "PresentationRequest" ("uuid" varchar(255) not null, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "prUuid" varchar(255) not null, "prCreatedAt" timestamptz(6) not null, "prUpdatedAt" timestamptz(6) not null, "prExpiresAt" timestamptz(6) not null, "prVerifier" varchar(255) not null, "prCredentialRequests" jsonb not null, "prProof" jsonb not null, "prMetadata" jsonb not null, "prHolderAppUuid" varchar(255) not null, "prVerifierInfo" jsonb not null, "prIssuerInfo" jsonb not null, "prDeeplink" text not null, "prQrCode" text not null);');
    this.addSql('alter table "PresentationRequest" add constraint "PresentationRequest_pkey" primary key ("uuid");');
  }

  async down (): Promise<void> {
    this.addSql('drop table "PresentationRequest";');
  }
}
