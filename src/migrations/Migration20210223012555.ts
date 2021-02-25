import { Migration } from '@mikro-orm/migrations';

export class Migration20210223012555 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Presentation" add column "isVerified" bool not null;');

    this.addSql('alter table "NoPresentation" add column "isVerified" bool not null;');
  }

  async down (): Promise<void> {
    this.addSql('alter table "Presentation" drop column "isVerified";');
    this.addSql('alter table "NoPresentation" drop column "isVerified";');
  }
}
