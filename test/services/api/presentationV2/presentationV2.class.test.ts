import { PresentationServiceV2 as PresentationService } from '../../../../src/services/api/presentationV2/presentationV2.class';
import { Application } from '../../../../src/declarations';
import * as serverSdk from '@unumid/server-sdk';
import { CryptoError } from '@unumid/library-crypto';

import {
  dummyEncryptedPresentation,
  dummyPresentationRequestEntity,
  dummyVerifierEntity,
  mockVerifiedEncryptedPresentation,
  dummyPresentation,
  mockNotVerifiedEncryptedPresentation,
  dummyPresentationRequestInfo,
  dummyVerifierDid,
  dummyEncryptedDeclinedPresentation,
  mockVerifiedEncryptedDeclinedPresentation,
  mockNotVerifiedEncryptedDeclinedPresentation,
  dummyDeclinedPresentation
} from '../../../mocksV2';

import { Presentation, PresentationReceiptInfo, VerificationResponse } from '@unumid/types';
import { CredentialInfo, extractCredentialInfo } from '@unumid/server-sdk';
import { PresentationEntityOptions } from '../../../../src/entities/Presentation';

import logger from '../../../../src/logger';
import { BadRequest } from '@feathersjs/errors';

describe('PresentationServiceV2', () => {
  let service: PresentationService;
  let app: Application;

  const mockDataService = {
    create: jest.fn(),
    get: jest.fn(),
    getDefaultVerifierEntity: jest.fn(),
    patch: jest.fn(),
    findOne: jest.fn()
  };

  beforeAll(() => {
    app = {
      service: () => {
        return mockDataService;
      }
    } as unknown as Application;
    service = new PresentationService({}, app);
  });

  describe('create', () => {
    beforeEach(() => {
      mockDataService.findOne.mockResolvedValueOnce(dummyPresentationRequestEntity);
      mockDataService.getDefaultVerifierEntity.mockResolvedValueOnce(dummyVerifierEntity);
      mockDataService.patch.mockResolvedValueOnce(dummyVerifierEntity);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('handles a valid encrypted Presentation', async () => {
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockVerifiedEncryptedPresentation));
      const response = await service.create(dummyEncryptedPresentation);

      // Expecting that the PresentationData service is the only data service using .create in this code path.
      expect(mockDataService.create).toBeCalled();

      // Expecting that the PresentationData service calls patch on the verifierData server to update the authToken
      expect(mockDataService.patch).toBeCalled();

      const expectedPresentationEntityOptions: PresentationEntityOptions = {
        presentationContext: dummyPresentation['@context'],
        presentationType: dummyPresentation.type,
        presentationVerifiableCredentials: dummyPresentation.verifiableCredential,
        presentationProof: dummyPresentation.proof,
        presentationPresentationRequestUuid: dummyPresentation.presentationRequestUuid,
        isVerified: true,
        verifierDid: dummyVerifierDid
      };

      // Expecting the data service to be called with the inputted Presentation attributes.
      expect(mockDataService.create).toBeCalledWith(expectedPresentationEntityOptions, undefined);

      const credentialInfo: CredentialInfo = extractCredentialInfo((dummyPresentation));
      const expectedPresentationReceiptInfo: PresentationReceiptInfo = {
        subjectDid: credentialInfo.subjectDid,
        credentialTypes: credentialInfo.credentialTypes,
        verifierDid: dummyVerifierEntity.verifierDid,
        holderApp: dummyPresentationRequestEntity.prHolderAppUuid,
        issuers: dummyPresentationRequestEntity.prIssuerInfo,
        presentationRequestUuid: dummyPresentation.presentationRequestUuid
      };

      const expectedVerificationResponse: VerificationResponse = {
        isVerified: true,
        type: 'VerifiablePresentation',
        presentationReceiptInfo: expectedPresentationReceiptInfo
      };

      // Expecting the response value to correspond to the inputted Presentation attributes.
      expect(response).toEqual(expectedVerificationResponse);
    });

    it('handles a valid encrypted DeclinedPresentation', async () => {
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockVerifiedEncryptedDeclinedPresentation));
      const response = await service.create(dummyEncryptedDeclinedPresentation);

      const credentialInfo: CredentialInfo = extractCredentialInfo((dummyDeclinedPresentation as unknown as Presentation));
      const expectedPresentationReceiptInfo: PresentationReceiptInfo = {
        subjectDid: credentialInfo.subjectDid,
        credentialTypes: credentialInfo.credentialTypes,
        verifierDid: dummyVerifierEntity.verifierDid,
        holderApp: dummyPresentationRequestInfo.presentationRequest.holderAppUuid,
        issuers: undefined,
        presentationRequestUuid: dummyPresentationRequestInfo.presentationRequest.uuid
      };

      const expectedVerificationResponse: VerificationResponse = {
        isVerified: true,
        type: 'DeclinedPresentation',
        presentationReceiptInfo: expectedPresentationReceiptInfo
      };

      // Expecting the response value to correspond to the inputted Presentation attributes.
      expect(response).toEqual(expectedVerificationResponse);
    });

    it('handles an invalid encrypted Presentation', async () => {
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockNotVerifiedEncryptedPresentation));
      jest.spyOn(logger, 'warn');
      try {
        const response = await service.create(dummyEncryptedPresentation);
        fail();
      } catch (e) {
        // Expecting that a warn level log is created & a BadRequest is thrown
        expect(logger.warn).toBeCalled();
        expect(e).toEqual(new BadRequest('Verification failed: '));
      }
    });

    it('handles an invalid encrypted NoPresentation', async () => {
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockNotVerifiedEncryptedDeclinedPresentation));
      jest.spyOn(logger, 'warn');
      try {
        const response = await service.create(dummyEncryptedDeclinedPresentation);
        fail();
      } catch (e) {
        // Expecting that a warn level log is created & a BadRequest is thrown
        expect(logger.warn).toBeCalled();
        expect(e).toEqual(new BadRequest('Verification failed: '));
      }
    });

    it('logs and re-throws errors thrown by the server sdk', async () => {
      jest.spyOn(logger, 'error');
      const err = new Error('server sdk error');
      jest.spyOn(serverSdk, 'verifyPresentation').mockRejectedValue(async () => (err));

      try {
        const response = await service.create(dummyEncryptedDeclinedPresentation);
        fail();
      } catch (e) {
        expect(logger.error).toBeCalled();
      }
    });

    it('logs and re-throws CryptoErrors thrown by the server sdk', async () => {
      jest.spyOn(logger, 'error');
      const err = new CryptoError('server sdk error');
      jest.spyOn(serverSdk, 'verifyPresentation').mockRejectedValue(async () => (err));

      try {
        const response = await service.create(dummyEncryptedDeclinedPresentation);
        fail();
      } catch (e) {
        expect(logger.error).toBeCalled();
      }
    });
  });
});
