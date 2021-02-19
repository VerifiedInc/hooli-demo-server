import { Migration } from '@mikro-orm/migrations';

export class Migration20210218232420 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "Session" ("uuid" varchar(255) not null, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null);');
    this.addSql('alter table "Session" add constraint "Session_pkey" primary key ("uuid");');
  }

  async down (): Promise<void> {
    this.addSql('drop table "Session";');
  }
}
