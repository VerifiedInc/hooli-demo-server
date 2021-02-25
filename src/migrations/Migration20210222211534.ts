import { Migration } from '@mikro-orm/migrations';

export class Migration20210222211534 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "NoPresentation" ("uuid" varchar(255) not null, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "npType" jsonb not null, "npProof" jsonb not null, "npHolder" varchar(255) not null, "npPresentationRequestUuid" varchar(255) not null);');
    this.addSql('alter table "NoPresentation" add constraint "NoPresentation_pkey" primary key ("uuid");');
  }

  async down (): Promise<void> {
    this.addSql('drop table "NoPresentation";');
  }
}
