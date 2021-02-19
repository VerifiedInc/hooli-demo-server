import { Migration } from '@mikro-orm/migrations';

export class Migration20210218235942 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "Verifier" ("uuid" varchar(255) not null, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "apiKey" varchar(255) not null, "authToken" text not null, "encryptionPrivateKey" text not null, "signingPrivateKey" text not null, "verifierDid" varchar(255) not null, "verifierUuid" varchar(255) not null, "verifierCreatedAt" timestamptz(6) not null, "verifierUpdatedAt" timestamptz(6) not null, "verifierName" varchar(255) not null, "verifierCustomerUuid" varchar(255) not null, "verifierUrl" varchar(255) not null, "verifierIsAuthorized" bool not null);');
    this.addSql('alter table "Verifier" add constraint "Verifier_pkey" primary key ("uuid");');
  }

  async down (): Promise<void> {
    this.addSql('drop table "Verifier"');
  }
}
