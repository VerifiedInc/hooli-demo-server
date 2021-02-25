import { HookContext } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { verifyPresentation, verifyNoPresentation } from '@unumid/server-sdk';
import { omit } from 'lodash';

import { validateData, verify, hooks } from '../../../../src/services/api/presentation/presentation.hooks';
import logger from '../../../../src/logger';
import { dummyPresentationVerificationResponse, dummyNoPresentationVerificationResponse, dummyPresentation, dummyNoPresentation, dummyVerifierEntity, dummyPresentationWithVerification, dummyNoPresentationWithVerification } from '../../../mocks';

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
        data: dummyPresentation,
        params: {}
      } as HookContext;

      validateData(ctx);
      expect(ctx.params.isValidated).toBe(true);
    });

    describe('validating a presentation', () => {
      it('throws a BadRequest if @context is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, '@context'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('@context is required.'));
        }
      });

      it('throws a BadRequest if uuid is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, 'uuid'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('uuid is required.'));
        }
      });

      it('throws a BadRequest if type is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, 'type'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('type is required.'));
        }
      });

      it('throws a BadRequest if verifiableCredential is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, 'verifiableCredential'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('verifiableCredential is required.'));
        }
      });

      it('throws a BadRequest if proof is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, 'proof'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('proof is required.'));
        }
      });

      it('throws a BadRequest if presentationRequestUuid is missing', () => {
        const ctx = {
          data: omit(dummyPresentation, 'presentationRequestUuid'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('presentationRequestUuid is required.'));
        }
      });
    });

    describe('validating a NoPresentation', () => {
      it('throws a BadRequest if type is missing', () => {
        const ctx = {
          data: omit(dummyNoPresentation, 'type'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('type is required.'));
        }
      });

      it('throws a BadRequest if proof is missing', () => {
        const ctx = {
          data: omit(dummyNoPresentation, 'proof'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('proof is required.'));
        }
      });

      it('throws a BadRequest if holder is missing', () => {
        const ctx = {
          data: omit(dummyNoPresentation, 'holder'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('holder is required.'));
        }
      });

      it('throws a BadRequest if presentationRequestUuid is missing', () => {
        const ctx = {
          data: omit(dummyNoPresentation, 'presentationRequestUuid'),
          params: {}
        } as HookContext;

        try {
          validateData(ctx);
          fail();
        } catch (e) {
          expect(e).toEqual(new BadRequest('presentationRequestUuid is required.'));
        }
      });
    });
  });

  describe('verify', () => {
    it('runs as the second before create hook', () => {
      expect(hooks.before.create[1]).toEqual(verify);
    });

    it('throws if data has not been validated', async () => {
      const ctx = {
        data: dummyPresentation,
        params: {}
      } as HookContext;

      try {
        await verify(ctx);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(GeneralError);
      }
    });

    describe('verifying a Presentation', () => {
      let ctx: HookContext;

      beforeEach(() => {
        ctx = {
          data: dummyPresentation,
          params: { isValidated: true },
          app: { service: () => ({ getDefaultVerifierEntity: () => dummyVerifierEntity, patch: jest.fn() }) }
        } as unknown as HookContext;
      });

      it('verifies the presentation using the server sdk', async () => {
        (verifyPresentation as jest.Mock).mockResolvedValueOnce(dummyPresentationVerificationResponse);
        await verify(ctx);
        expect(verifyPresentation).toBeCalledWith(
          dummyVerifierEntity.authToken,
          dummyPresentation,
          dummyVerifierEntity.verifierDid
        );
      });

      it('logs and re-throws errors thrown by the server sdk', async () => {
        jest.spyOn(logger, 'error');
        const err = new Error('server sdk error');
        (verifyPresentation as jest.Mock).mockRejectedValueOnce(err);

        try {
          await verify(ctx);
          fail();
        } catch (e) {
          expect(logger.error).toBeCalledWith('verify caught an error thrown by the server sdk.', err);
          expect(e).toEqual(new GeneralError('Error verifying presentation.'));
        }
      });

      it('updates the hook context data', async () => {
        (verifyPresentation as jest.Mock).mockResolvedValueOnce(dummyPresentationVerificationResponse);
        await verify(ctx);
        expect(ctx.data).toEqual(dummyPresentationWithVerification);
      });
    });

    describe('verifying a NoPresentation', () => {
      let ctx: HookContext;

      beforeEach(() => {
        ctx = {
          data: dummyNoPresentation,
          params: { isValidated: true },
          app: { service: () => ({ getDefaultVerifierEntity: () => dummyVerifierEntity, patch: jest.fn() }) }
        } as unknown as HookContext;
      });

      it('verifies the noPresentation using the server sdk', async () => {
        (verifyNoPresentation as jest.Mock).mockResolvedValueOnce(dummyNoPresentationVerificationResponse);
        await verify(ctx);
        expect(verifyNoPresentation).toBeCalledWith(
          dummyVerifierEntity.authToken,
          dummyNoPresentation,
          dummyVerifierEntity.verifierDid
        );
      });

      it('logs and re-throws errors thrown by the server sdk', async () => {
        jest.spyOn(logger, 'error');
        const err = new Error('server sdk error');
        (verifyNoPresentation as jest.Mock).mockRejectedValueOnce(err);

        try {
          await verify(ctx);
          fail();
        } catch (e) {
          expect(logger.error).toBeCalledWith('verify caught an error thrown by the server sdk.', err);
          expect(e).toEqual(new GeneralError('Error verifying noPresentation.'));
        }
      });

      it('updates the hook context data', async () => {
        (verifyNoPresentation as jest.Mock).mockResolvedValueOnce(dummyNoPresentationVerificationResponse);
        await verify(ctx);
        expect(ctx.data).toEqual(dummyNoPresentationWithVerification);
      });
    });
  });
});
