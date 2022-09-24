import { HookContext } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { sendRequest } from '@unumid/server-sdk';

import {
  validatePresentationRequestOptions,
  sendRequestHook,
  hooks
} from '../../../../src/services/api/presentationRequest/presentationRequest.hooks';
import { dummyIssuerDid, dummyPresentationRequestPostDto, dummyVerifierEntity } from '../../../mocks';
import { config } from '../../../../src/config';
import logger from '../../../../src/logger';

jest.mock('@unumid/server-sdk');

describe('presentationRequest service hooks', () => {
  describe('validatePresentationRequestOptions', () => {
    it('runs as the first before create hook', () => {
      expect(hooks.before.create[0]).toEqual(validatePresentationRequestOptions);
    });

    it('throws a BadRequest if data is missing', () => {
      const ctx = {} as HookContext;
      try {
        validatePresentationRequestOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('data is required.'));
      }
    });

    it('throws a BadRequest if credentialRequests is missing', () => {
      const ctx = {
        data: {}
      } as HookContext;
      try {
        validatePresentationRequestOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('credentialRequests is required.'));
      }
    });

    it('throws a BadRequest if credentialRequest type is missing', () => {
      const ctx = {
        data: {
          credentialRequests: [{ issuers: [dummyIssuerDid] }]
        }
      } as HookContext;
      try {
        validatePresentationRequestOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('credentialRequest type is required.'));
      }
    });

    it('throws a BadRequest if credentialRequest issuers is missing', () => {
      const ctx = {
        data: {
          credentialRequests: [{ type: 'TestCredential' }]
        }
      } as HookContext;
      try {
        validatePresentationRequestOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('credentialRequest issuers is required.'));
      }
    });

    it('marks the hook context as validated', () => {
      const ctx = {
        data: {
          credentialRequests: [{
            type: 'TestCredential',
            issuers: [dummyIssuerDid]
          }]
        },
        params: {}
      } as HookContext;
      validatePresentationRequestOptions(ctx);
      expect(ctx.params.isValidated).toBe(true);
    });
  });

  describe('sendRequestHook', () => {
    it('runs as the second before create hook', () => {
      expect(hooks.before.create[1]).toEqual(sendRequestHook);
    });

    it('throws if the incoming data has not been validated', async () => {
      const ctx = {
        data: {
          credentialRequests: [{
            type: 'TestCredential',
            issuers: [dummyIssuerDid]
          }]
        },
        params: {}
      } as unknown as HookContext;

      try {
        await sendRequestHook(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new GeneralError('Hook context has not been validated. Did you forget to run the validatePresentationRequestOptions hook before this one?'));
      }
    });

    it('sends a request using the server sdk', async () => {
      const credentialRequests = [{
        type: 'TestCredential',
        issuers: [dummyIssuerDid]
      }];

      const ctx = {
        data: { credentialRequests, metadata: dummyPresentationRequestPostDto.presentationRequest.metadata },
        params: { isValidated: true },
        app: { service: () => ({ getDefaultVerifierEntity: () => dummyVerifierEntity, patch: jest.fn() }) }
      } as unknown as HookContext;

      (sendRequest as jest.Mock).mockResolvedValue({
        body: dummyPresentationRequestPostDto,
        authToken: dummyVerifierEntity.authToken
      });

      await sendRequestHook(ctx);

      expect(sendRequest).toBeCalledWith(
        dummyVerifierEntity.authToken,
        dummyVerifierEntity.verifierDid,
        credentialRequests,
        dummyVerifierEntity.signingPrivateKey,
        config.HOLDER_APP_UUID,
        undefined,
        dummyPresentationRequestPostDto.presentationRequest.metadata
      );
    });

    it('logs and re-throws errors thrown by the server sdk', async () => {
      jest.spyOn(logger, 'error');

      const credentialRequests = [{
        type: 'TestCredential',
        issuers: [dummyIssuerDid]
      }];

      const ctx = {
        data: { credentialRequests },
        params: { isValidated: true },
        app: { service: () => ({ getDefaultVerifierEntity: () => dummyVerifierEntity, patch: jest.fn() }) }
      } as unknown as HookContext;

      const err = new Error('server sdk error');
      (sendRequest as jest.Mock).mockRejectedValueOnce(err);

      try {
        await sendRequestHook(ctx);
        fail();
      } catch (e) {
        expect(logger.error).toBeCalledWith('sendRequestHook caught an error thrown by the server sdk', err);
        expect(e).toEqual(new GeneralError('Error sending request.'));
      }
    });
  });
});
