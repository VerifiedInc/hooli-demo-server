import { PresentationService } from '../../../../src/services/api/presentation/presentation.class';
import { Application } from '../../../../src/declarations';
import * as serverSdk from '@unumid/server-sdk-deprecated-v1';
import { CryptoError } from '@unumid/library-crypto';

import {
  dummyEncryptedPresentation,
  dummyPresentationRequestEntity,
  dummyVerifierEntity,
  mockVerifiedEncryptedPresentation,
  dummyPresentation,
  mockVerifiedEncryptedNoPresentation,
  dummyEncryptedNoPresentation,
  dummyNoPresentation,
  mockNotVerifiedEncryptedPresentation,
  mockNotVerifiedEncryptedNoPresentation,
  dummyAuthToken,
  dummyPresentationRequestInfo,
  dummyVerifierDid
} from '../../../mocks';

import { Presentation, PresentationReceiptInfo } from '@unumid/types-deprecated-v1';
import { CredentialInfo, extractCredentialInfo } from '@unumid/server-sdk-deprecated-v1';
import { PresentationEntityOptions } from '../../../../src/entities/Presentation';
import { VerificationResponse } from '@unumid/demo-types-deprecated-v1';
import { NoPresentationEntityOptions } from '../../../../src/entities/NoPresentation';
import logger from '../../../../src/logger';
import { BadRequest } from '@feathersjs/errors';

describe('PresentationService', () => {
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
        presentationVerifiableCredentials: dummyPresentation.verifiableCredentials,
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
        holderApp: undefined,
        issuers: dummyPresentationRequestEntity.prIssuerInfo
      };

      const expectedVerificationResponse: VerificationResponse = {
        isVerified: true,
        type: 'VerifiablePresentation',
        presentationReceiptInfo: expectedPresentationReceiptInfo,
        presentationRequestUuid: dummyPresentation.presentationRequestUuid
      };

      // Expecting the response value to correspond to the inputted Presentation attributes.
      expect(response).toEqual(expectedVerificationResponse);
    });

    it('handles a valid encrypted NoPresentation', async () => {
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockVerifiedEncryptedNoPresentation));
      const response = await service.create(dummyEncryptedNoPresentation);

      // Expecting that the PresentationData service is the only data service using .create in this code path.
      expect(mockDataService.create).toBeCalled();

      // Expecting that the PresentationData service calls patch on the verifierData server to update the authToken
      expect(mockDataService.patch).toBeCalled();

      const expectedNoPresentationEntityOptions: NoPresentationEntityOptions = {
        npType: dummyNoPresentation.type,
        npProof: dummyNoPresentation.proof,
        npPresentationRequestUuid: dummyNoPresentation.presentationRequestUuid,
        npHolder: dummyNoPresentation.holder,
        isVerified: true
      };

      // Expecting the data service to be called with the inputted Presentation attributes.
      expect(mockDataService.create).toBeCalledWith(expectedNoPresentationEntityOptions, undefined);

      const credentialInfo: CredentialInfo = extractCredentialInfo((dummyNoPresentation as unknown as Presentation));
      const expectedPresentationReceiptInfo: PresentationReceiptInfo = {
        subjectDid: credentialInfo.subjectDid,
        credentialTypes: [],
        verifierDid: dummyVerifierEntity.verifierDid,
        holderApp: dummyNoPresentation.holder,
        issuers: undefined
      };

      const expectedVerificationResponse: VerificationResponse = {
        isVerified: true,
        type: 'NoPresentation',
        presentationReceiptInfo: expectedPresentationReceiptInfo,
        presentationRequestUuid: dummyPresentationRequestInfo.presentationRequest.uuid
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
      jest.spyOn(serverSdk, 'verifyPresentation').mockImplementation(async () => (mockNotVerifiedEncryptedNoPresentation));
      jest.spyOn(logger, 'warn');
      try {
        const response = await service.create(dummyEncryptedNoPresentation);
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
        const response = await service.create(dummyEncryptedNoPresentation);
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
        const response = await service.create(dummyEncryptedNoPresentation);
        fail();
      } catch (e) {
        expect(logger.error).toBeCalled();
      }
    });
  });
});
