import fs from 'fs';
import path from 'path';

import { Migration } from '@mikro-orm/migrations';

export class Migration20210409200341 extends Migration {
  async up (): Promise<void> {
    // add the prHolderAppInfo column, allowing null values to account for existing rows
    this.addSql('alter table "PresentationRequest" add column "prHolderAppInfo" jsonb;');
    const img = fs.readFileSync(path.join(__dirname, '../../test/mocks/verify-with-acme-button.png'));
    const defaultHolderAppInfo = {
      name: 'ACME',
      uriScheme: 'acme://',
      deeplinkButtonImg: `data:image/png;base64,${img.toString('base64')}`
    };
    // insert a dummy value for existing rows
    this.addSql(`update "PresentationRequest" set "prHolderAppInfo" = '${JSON.stringify(defaultHolderAppInfo)}' where "prHolderAppInfo" is null;`);
    // safely set the column to be not null now that all rows have a non-null value
    this.addSql('alter table "PresentationRequest" alter column "prHolderAppInfo" set not null;');
  }

  async down (): Promise<void> {
    this.addSql('alter table "PresentationRequest" drop column "prHolderAppInfo";');
  }
}
