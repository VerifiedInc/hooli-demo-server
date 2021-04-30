import { HookContext } from '@feathersjs/feathers';
import { SemVer, gte, valid } from 'semver';

/**
 * Helper to determine wether a request was sent with the version header that satisfies the provided minimum requirement.
 * Note: ought be passing in versions which live the versions.tf file definition.
 * @param ctx: HookContext
 * @param minSemVer: SemVer
 */
export function isVersionSatisfied (ctx: HookContext, minSemVer: SemVer): boolean {
  // validate a valid sematic version is in the header of the context.
  if (ctx.params.headers && valid(ctx.params.headers.version)) {
    const requestSemVer = valid(ctx.params.headers.version) as string;

    // returns true with the requestSemVer is greater than or equal to the minium sematic versioning parameter
    return gte(requestSemVer, minSemVer);
  }

  return false;
}
