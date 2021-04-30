import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { omit } from 'lodash';

import { validateData, hooks } from '../../../../src/services/api/presentationV2/presentationV2.hooks';
import { dummyEncryptedPresentation } from '../../../mocksV2';

jest.mock('@unumid/server-sdk');

describe('presentation v2 service hooks', () => {
  describe('validateData', () => {
    it('runs as the first before create hook', () => {
      expect(hooks.before.create[0]).toEqual(validateData);
    });

    it('throws a BadRequest if data is missing', () => {
      const ctx = {
        params: {}
      } as HookContext;

      try {
        validateData(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('data is required.'));
      }
    });

    it('marks the hook context as validated', () => {
      const ctx = {
        data: dummyEncryptedPresentation,
        params: { headers: { version: '2.0.0' } }
      } as unknown as HookContext;

      validateData(ctx);
      expect(ctx.params.isValidated).toBe(true);
    });

    describe('validating an encrypted presentation', () => {
      it('throws a BadRequest if version is not valid semver syntax', () => {
        const ctx = {
          data: dummyEncryptedPresentation,
          params: { headers: { version: '1x.0.0' } }
        } as unknown as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('version header must be in valid semver notation.'));
        }
      });
      it('throws a BadRequest if version is less than 2.0.0', () => {
        const ctx = {
          data: dummyEncryptedPresentation,
          params: { headers: { version: '1.0.0' } }
        } as unknown as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('version header must be greater than 2.0.0 for the presentationV2 service.'));
        }
      });
      it('throws a BadRequest if presentationRequestInfo is missing', () => {
        const ctx = {
          data: omit(dummyEncryptedPresentation, 'presentationRequestInfo'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('presentationRequestInfo is required.'));
        }
      });

      it('throws a BadRequest if encryptedPresentation is missing', () => {
        const ctx = {
          data: omit(dummyEncryptedPresentation, 'encryptedPresentation'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('encryptedPresentation is required.'));
        }
      });
    });
  });
});
