import { Migration } from '@mikro-orm/migrations';

export class Migration20210222194859 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "Presentation" ("uuid" varchar(255) not null, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "presentationContext" jsonb not null, "presentationUuid" varchar(255) not null, "presentationType" jsonb not null, "presentationVerifiableCredential" jsonb not null, "presentationProof" jsonb not null, "presentationPresentationRequestUuid" varchar(255) not null);');
    this.addSql('alter table "Presentation" add constraint "Presentation_pkey" primary key ("uuid");');
  }

  async down (): Promise<void> {
    this.addSql('drop table "Presentation";');
  }
}
