import { HookContext } from '@feathersjs/feathers';
import { pick } from 'lodash';

import logger from './logger';

function logError (ctx: HookContext): void {
  const { path, method, error } = ctx;
  const { name, code, message, stack } = error;
  const rawInfo = pick(ctx, ['params', 'id', 'data']);
  const info = { ...rawInfo, stack };

  if (info.params?.headers?.authorization) {
    info.params.headers.authorization = 'Bearer *****';
  }

  if (info.params?.authToken) {
    info.params.authToken = '*****';
  }

  logger.warn(`Error in ${path}#${method}: name=${name} code=${code} message=${message}`, info);
}

function log (ctx: HookContext): HookContext {
  const { path, method, id, data } = ctx;
  const string = data && JSON.stringify(data);
  const length = 2000;
  const dataString = string && (string.length < length ? string : string.substring(0, length - 3) + '...');
  logger.info(`${path}#${method}${id ? ` id: ${id}` : ''}${data ? ` data: ${dataString}}` : ''}`);
  return ctx;
}

function logResult (ctx: HookContext): HookContext {
  const { path, method, result } = ctx;
  const string = JSON.stringify(result);
  const length = 1500; // prevent exceedingly long result log messages.
  const resultString = string.length < length ? string : string.substring(0, length - 3) + '...';

  logger.info(`${path}#${method} result: ${resultString}`);
  return ctx;
}

export default {
  before: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [logResult],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [logError],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
