import { Migration } from '@mikro-orm/migrations';

export class Migration20210224012431 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "PresentationRequest" drop constraint if exists "PresentationRequest_prExpiresAt_check";');
    this.addSql('alter table "PresentationRequest" alter column "prExpiresAt" type timestamptz(6) using ("prExpiresAt"::timestamptz(6));');
    this.addSql('alter table "PresentationRequest" alter column "prExpiresAt" drop not null;');
  }
}
