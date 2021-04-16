import { RequestContext } from '@mikro-orm/core';
import { Request, Response, NextFunction } from 'express';
import { Application } from '../declarations';
import logger from '../logger';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.use((req, res, next) => {
    // As a fix for .flush validation errors, ref: https://mikro-orm.io/docs/faq/#you-cannot-call-emflush-from-inside-lifecycle-hook-handlers
    // Having a unique Mikro-ORM request context per request. ref: https://mikro-orm.io/docs/identity-map/#!
    RequestContext.create(app.get('orm').em, next);
  });
}
