import { Migration } from '@mikro-orm/migrations';

export class Migration20210402210705 extends Migration {
  async up (): Promise<void> {
    this.addSql('create index "PresentationRequest_prUuid_index" on "PresentationRequest" ("prUuid");');
  }
}
