import { Migration } from '@mikro-orm/migrations';

export class Migration20210429214908 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Verifier" add column "verifierVersionInfo" jsonb;');
    const versionInfo = [{
      target: {
        version: '2.0.0' // customer api version
      },
      sdkVersion: '2.0.0' // server sdk
    }, {
      target: {
        version: '1.0.0' // customer api version
      },
      sdkVersion: '1.0.0' // server sdk
    }];

    this.addSql(`update "Verifier" set "verifierVersionInfo" = '${JSON.stringify(versionInfo)}' where "verifierVersionInfo" is null;`);
    this.addSql('alter table "Verifier" alter column "verifierVersionInfo" set not null;');
  }

  async down (): Promise<void> {
    this.addSql('alter table "Verifier" drop column "verifierVersionInfo";');
  }
}
