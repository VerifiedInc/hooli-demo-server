import { Migration } from '@mikro-orm/migrations';

export class Migration20210605005617 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "PresentationRequest" add column "prId" varchar(255) not null;');
    this.addSql('alter table "PresentationRequest" drop constraint if exists "PresentationRequest_prMetadata_check";');
    this.addSql('alter table "PresentationRequest" alter column "prMetadata" type jsonb using ("prMetadata"::jsonb);');
    this.addSql('alter table "PresentationRequest" alter column "prMetadata" drop not null;');
  }
}
