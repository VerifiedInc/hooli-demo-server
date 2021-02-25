import { Entity } from '@mikro-orm/core';
import { DemoSession } from '@unumid/demo-types';

import { BaseEntity } from './BaseEntity';

@Entity()
export class Session extends BaseEntity implements DemoSession { }
