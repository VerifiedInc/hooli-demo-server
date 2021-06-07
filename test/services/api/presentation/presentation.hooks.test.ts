import { HookContext } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
// import { verifyPresentation, verifyNoPresentation } from '@unumid/server-sdk';
import { omit } from 'lodash';

import { validateData, hooks } from '../../../../src/services/api/presentation/presentation.hooks';
import logger from '../../../../src/logger';
import { dummyPresentationVerificationResponse, dummyNoPresentationVerificationResponse, dummyPresentation, dummyNoPresentation, dummyVerifierEntity, dummyPresentationWithVerification, dummyNoPresentationWithVerification, dummyEncryptedPresentation, dummyVerifierDid, rsaPublicKeyPem } from '../../../mocks';
import { encrypt, sign } from '@unumid/library-crypto';

jest.mock('@unumid/server-sdk');

describe('presentation service hooks', () => {
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
        params: { headers: { version: '1.0.0' } }
      } as unknown as HookContext;

      validateData(ctx);
      expect(ctx.params.isValidated).toBe(true);
    });

    describe('validating an encrypted presentation', () => {
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
