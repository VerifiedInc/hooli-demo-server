import { Migration } from '@mikro-orm/migrations';

export class Migration20210331232900 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Presentation" drop column "presentationUuid";');
  }
}
