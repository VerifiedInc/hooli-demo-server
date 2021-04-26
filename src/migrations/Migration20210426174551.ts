import { Migration } from '@mikro-orm/migrations';

export class Migration20210426174551 extends Migration {
  async up (): Promise<void> {
    this.addSql('update "Presentation" set "verifierDid" = "did:unum:f2054199-1069-4337-a588-83d099e79d44" where "verifierDid" is null;');
    this.addSql('alter table "Presentation" add column "verifierDid" varchar(255) not null;');
  }
}
