import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { omit } from 'lodash';

import { validateData, hooks } from '../../../../src/services/api/presentationV3/presentationV3.hooks';
import { dummyEncryptedPresentation } from '../../../mocksV2';

jest.mock('@unumid/server-sdk');

describe('presentation v3 service hooks', () => {
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
        params: { headers: { version: '3.0.0' } }
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
      it('throws a BadRequest if version is less than 3.0.0', () => {
        const ctx = {
          data: dummyEncryptedPresentation,
          params: { headers: { version: '2.0.0' } }
        } as unknown as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('version header must be 3.x.x for the presentationV3 service.'));
        }
      });

      it('throws a BadRequest if version header is missing', () => {
        const ctx = {
          data: omit(dummyEncryptedPresentation, 'encryptedPresentation'),
          params: { headers: {} }
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('version header is required.'));
        }
      });

      it('throws a BadRequest if presentationRequestInfo is missing', () => {
        const ctx = {
          data: omit(dummyEncryptedPresentation, 'presentationRequestInfo'),
          params: { headers: { version: '3.0.0' } }
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
          params: { headers: { version: '3.0.0' } }
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
