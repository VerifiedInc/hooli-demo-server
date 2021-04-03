import { Migration } from '@mikro-orm/migrations';

export class Migration20210402221816 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Presentation" rename column "presentationVerifiableCredential" to "presentationVerifiableCredentials";');
  }
}
