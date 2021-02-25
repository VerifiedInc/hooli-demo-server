import { Property, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { DemoBaseEntity } from '@unumid/demo-types';

export interface BaseEntityOptions {
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseEntity implements DemoBaseEntity {
  @PrimaryKey()
  uuid: string;

  @Property({ columnType: 'timestamptz(6)' })
  createdAt: Date;

  @Property({ columnType: 'timestamptz(6)', onUpdate: () => new Date() })
  updatedAt: Date;

  constructor (options: BaseEntityOptions) {
    const { uuid, createdAt, updatedAt } = options;

    this.uuid = uuid || v4();
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || this.createdAt;
  }
}
