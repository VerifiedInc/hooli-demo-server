import { HookContext } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { registerVerifier } from '@unumid/server-sdk';

import { validateVerifierCreateOptions, hooks, registerVerifierHook } from '../../../../src/services/api/verifier/verifier.hooks';
import { v4 } from 'uuid';
import { dummyVerifierRegistrationResponse, dummyVerifierRequestDto, customerUuid } from '../../../mocks';
import logger from '../../../../src/logger';

jest.mock('@unumid/server-sdk');

describe('verifier service hooks', () => {
  describe('validateVerifierCreateOptions', () => {
    it('runs as the first before create hook', () => {
      expect(hooks.before.create[0]).toEqual(validateVerifierCreateOptions);
    });

    it('throws a BadRequest if data is missing', () => {
      const ctx = {} as HookContext;
      try {
        validateVerifierCreateOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('data is required.'));
      }
    });

    it('throws a BadRequest if apiKey is missing', () => {
      const ctx = {
        data: {
          customerUuid: v4(),
          name: 'test verifier',
          url: 'https://verifier.unum.id/presentation'
        }
      } as HookContext;

      try {
        validateVerifierCreateOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('apiKey is required.'));
      }
    });

    it('throws a BadRequest if customerUuid is missing', () => {
      const ctx = {
        data: {
          apiKey: 'dummy api key',
          name: 'test verifier',
          url: 'https://verifier.unum.id/presentation'
        }
      } as HookContext;

      try {
        validateVerifierCreateOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('customerUuid is required.'));
      }
    });

    it('throws a BadRequest if name is missing', () => {
      const ctx = {
        data: {
          customerUuid: v4(),
          apiKey: 'dummy api key',
          url: 'https://verifier.unum.id/presentation'
        }
      } as HookContext;

      try {
        validateVerifierCreateOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('name is required.'));
      }
    });

    it('throws a BadRequest if url is missing', () => {
      const ctx = {
        data: {
          customerUuid: v4(),
          name: 'test verifier',
          apiKey: 'dummy api key'
        }
      } as HookContext;

      try {
        validateVerifierCreateOptions(ctx);
        fail();
      } catch (e) {
        expect(e).toEqual(new BadRequest('url is required.'));
      }
    });

    it('marks the hook context as validated', () => {
      const ctx = {
        data: {
          customerUuid: v4(),
          name: 'test verifier',
          apiKey: 'dummy api key',
          url: 'https://verifier.unum.id/presentation',
          versionInfo: []
        },
        params: { headers: { version: '1.0.0' } }
      } as unknown as HookContext;
      validateVerifierCreateOptions(ctx);
      expect(ctx.params.isValidated).toBe(true);
    });
  });

  describe('registerVerifierHook', () => {
    it('runs as the second before create hook', () => {
      expect(hooks.before.create[1]).toEqual(registerVerifierHook);
    });

    it('throws if the incoming data has not been validated', async () => {
      const ctx = {
        data: {
          customerUuid: v4(),
          name: 'test verifier',
          apiKey: 'dummy api key',
          url: 'https://verifier.unum.id/presentation'
        },
        params: {}
      } as HookContext;

      try {
        await registerVerifierHook(ctx);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('registers a verifier using the server sdk', async () => {
      const ctx = {
        data: {
          customerUuid,
          name: 'test verifier',
          apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
          url: 'https://verifier-api.demo.unum.id/presentation',
          versionInfo: [{ target: { version: '2.0.0' }, sdkVersion: '2.0.0' }]
        },
        params: { isValidated: true }
      } as unknown as HookContext;

      (registerVerifier as jest.Mock).mockResolvedValueOnce(dummyVerifierRegistrationResponse);
      await registerVerifierHook(ctx);

      expect(registerVerifier).toBeCalledWith(
        'test verifier',
        customerUuid,
        'https://verifier-api.demo.unum.id/presentation',
        'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
        [{ target: { version: '2.0.0' }, sdkVersion: '2.0.0' }]
      );
    });

    it('logs and re-throws errors thrown by the server sdk', async () => {
      jest.spyOn(logger, 'error');
      const ctx = {
        data: {
          customerUuid,
          name: 'test verifier',
          apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
          url: 'https://verifier-api.demo.unum.id/presentation'
        },
        params: { isValidated: true }
      } as unknown as HookContext;

      const err = new Error('server sdk error');
      (registerVerifier as jest.Mock).mockRejectedValueOnce(err);

      try {
        await registerVerifierHook(ctx);
        fail();
      } catch (e) {
        expect(logger.error).toBeCalledWith('registerVerifierHook caught an error thrown by the server sdk', err);
        expect(e).toEqual(new GeneralError('Error registering verifier.'));
      }
    });

    it('updates the hook context data', async () => {
      const ctx = {
        data: {
          customerUuid,
          name: 'test verifier',
          apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
          url: 'https://verifier-api.demo.unum.id/presentation',
          versionInfo: [{ target: { version: '2.0.0' }, sdkVersion: '2.0.0' }]
        },
        params: { isValidated: true }
      } as unknown as HookContext;

      (registerVerifier as jest.Mock).mockResolvedValueOnce(dummyVerifierRegistrationResponse);
      await registerVerifierHook(ctx);

      expect(ctx.data).toEqual(dummyVerifierRequestDto);
    });
  });
});
