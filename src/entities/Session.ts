import { Entity } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

@Entity()
export class Session extends BaseEntity { }
