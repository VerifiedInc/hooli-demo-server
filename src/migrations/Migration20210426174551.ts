import { Migration } from '@mikro-orm/migrations';

export class Migration20210426174551 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Presentation" add column "verifierDid" varchar(255) not null;');
  }
}
