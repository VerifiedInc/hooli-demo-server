import { v4 } from 'uuid';
import {
  Credential,
  Presentation,
  PresentationRequestPostDto,
  NoPresentation
} from '@unumid/types';

import { VerifierEntityOptions, VerifierEntity } from '../src/entities/Verifier';
import { PresentationRequestEntity, PresentationRequestEntityOptions } from '../src/entities/PresentationRequest';
import { Session } from '../src/entities/Session';
import { PresentationEntityOptions, PresentationEntity } from '../src/entities/Presentation';
import { NoPresentationEntity, NoPresentationEntityOptions } from '../src/entities/NoPresentation';
import { VerifierRequestDto, VerifierResponseDto } from '../src/services/api/verifier/verifier.class';
import {
  PresentationWithVerification,
  NoPresentationWithVerification
} from '../src/services/api/presentation/presentation.class';
import { DemoNoPresentationDto, DemoPresentationDto, DemoPresentationRequestDto } from '@unumid/demo-types';

export const dummyVerifierDid = `did:unum:${v4()}`;
export const dummyIssuerDid = `did:unum:${v4()}`;
export const now = new Date();
const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

const verifierUuid = v4();
export const customerUuid = v4();

export const dummyVerifierEntityOptions: VerifierEntityOptions = {
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  encryptionPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5vL6S1xkvQukL\nMvi9JoM1yqzp+sdyYVPzF1pTs/cJ+f2HDYTkfb5Jzlc5DElR5cYmPJYyDft0bD68\npZstjLkRZVEawgSvNglGiiN/N3NihvcvDg7kjfhcuOXSY1s+Y/sHl7EB50nBNrkW\nSzhreKrBsgG7DtgKZNuA/rleWK4JE8veUDYz9CLexkUw3p3JWhKx50lYxHV/iZto\n+iP4VfWyJ4YHW1pLFaG3MYnjvM46XBqCUCW4YOX0PHerNYukXx0EvndoxvFgXQwJ\nck/xlpCoaCxZFVv5HvkHSe6HstsQzImh2j1TTXxNCnGd1xaXeQIoUqQk/jW6DFEU\nEqcNy1n9AgMBAAECggEBAJwKsQTGh1cIXKdW/FhVCbjgfGLamENE93VsMivOLwaH\nqvKSbgpUhdCV9Pttkg+m/dDT589HpfDKm+57JyKebkDqILhdNfhJaoODvIy9dkfZ\nYcN7iRGFIJotkI8vf9Grx5M6YrBZssILinXrXgwURUkTlpajwucAktUNq4hS8muW\ncmNGVIlos4kJ36TL+wsyxS0MrdvghreMykG9Pbbhg/JL3civ43Dssl9YWomhZge2\n46cfiB4mf0eMyIEhNHCwqecSqz3IyZLoyifp1BO+SgPRs5MO7xt3gp/u1aQAQtg5\nZgLPhOWQJ0GLkbXG/cusSnPxV9tTF6WP9AYdEoK1RCECgYEA41Rci/9BcrryY6bx\nUOWwy/GOlWWAKobfJZMUyjP7kBUKrTHAJ6nL0U6ifPsrTQADCoYSWRG1pmlhsVXb\nnHM+ExXCb5Gb8vXbZK9GSoqDrB/Lu3TFWSOdz4yhVraKfsohNAeiF0OnC1wCuPTB\nuNSY43BGAz/lHiTbvn7TK+41JlkCgYEA0SmFc99RKyGab+x4r38M4dHQyGfd2Kzy\nCVcdNVUe5Idnnu5OZCFN0ORMeoWZIuR8IeGj8vcCq/48215P9onoQEFrIo805Bw5\njX9XMToJVsg1hWznpqZm0mU/900VMOhJaeIAWvfTWiMIRgAy702hvt8zFf7duNhR\nOBQ8eqU/pEUCgYArHqJbT7SLXZiCfHUDgj3xwUTpY5JW/rQu/WIRJKEP6F3ZEjm/\njD6D2iWKDV5eQaVSBrJOQMSy5wRHzeBVIarhldwGq5joEehmhbSQiQuGx5UuXmzc\nhpv1dVhZCVDl0dNQei4tuYBi8DX3/T0NoQ3K/k3ZafI8sIMZ9BZ8G7frKQKBgQCM\n1chmHRgqUpYKhs88W+/wnbZXOpjGLK1MXLvuDUKf3gyHly5xfXtIDHDyjsJuHCr5\nJVWfY3MJHEcd7oMpHfKkUWgx/PtAHUEjZXrwSoO/S0++Z3YTYDgbstE/U0fRhpbo\nFKTom7ZUGwKXH8ssFrmyK9faF6JztDP77qRKcLpJgQKBgQCjBebFOW0TAQs8vhjS\nEsoDJ5J1Y7hTseFJ2sTLWfexHo3wXPC94cKsb65OFPoIaPFs5qOdf590unn7RpZP\nIl90M1J7jM+8xvUV3J2rCI3qejQZ0PF8uPvGs+NrSMc/eSicaHh5su+V7o4BGe3t\n0hdCNUBBY/Z2pJ5c9uijTEDL0A==\n-----END PRIVATE KEY-----\n',
  signingPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIO4b3u0fjjEMdDlT\nzxVOY0i7Hvf6g0JDByzkn0J/YuehRANCAASEbG0IWej3rPbxRmHDLWj8CE/ZzS0Y\n7BzuhVemjSBO1Iu1dZhY1+4KRak+rYlEb2rE5w91P69uTHl+YPAw5Ofa\n-----END PRIVATE KEY-----\n',
  verifierDid: dummyVerifierDid,
  verifierUuid: verifierUuid,
  verifierCreatedAt: now,
  verifierUpdatedAt: now,
  verifierName: 'test verifier',
  verifierCustomerUuid: customerUuid,
  verifierUrl: 'https://verifier-api.demo.unum.id/presentation',
  verifierIsAuthorized: true
};

export const dummyVerifierRequestDto: VerifierRequestDto = {
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  encryptionPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5vL6S1xkvQukL\nMvi9JoM1yqzp+sdyYVPzF1pTs/cJ+f2HDYTkfb5Jzlc5DElR5cYmPJYyDft0bD68\npZstjLkRZVEawgSvNglGiiN/N3NihvcvDg7kjfhcuOXSY1s+Y/sHl7EB50nBNrkW\nSzhreKrBsgG7DtgKZNuA/rleWK4JE8veUDYz9CLexkUw3p3JWhKx50lYxHV/iZto\n+iP4VfWyJ4YHW1pLFaG3MYnjvM46XBqCUCW4YOX0PHerNYukXx0EvndoxvFgXQwJ\nck/xlpCoaCxZFVv5HvkHSe6HstsQzImh2j1TTXxNCnGd1xaXeQIoUqQk/jW6DFEU\nEqcNy1n9AgMBAAECggEBAJwKsQTGh1cIXKdW/FhVCbjgfGLamENE93VsMivOLwaH\nqvKSbgpUhdCV9Pttkg+m/dDT589HpfDKm+57JyKebkDqILhdNfhJaoODvIy9dkfZ\nYcN7iRGFIJotkI8vf9Grx5M6YrBZssILinXrXgwURUkTlpajwucAktUNq4hS8muW\ncmNGVIlos4kJ36TL+wsyxS0MrdvghreMykG9Pbbhg/JL3civ43Dssl9YWomhZge2\n46cfiB4mf0eMyIEhNHCwqecSqz3IyZLoyifp1BO+SgPRs5MO7xt3gp/u1aQAQtg5\nZgLPhOWQJ0GLkbXG/cusSnPxV9tTF6WP9AYdEoK1RCECgYEA41Rci/9BcrryY6bx\nUOWwy/GOlWWAKobfJZMUyjP7kBUKrTHAJ6nL0U6ifPsrTQADCoYSWRG1pmlhsVXb\nnHM+ExXCb5Gb8vXbZK9GSoqDrB/Lu3TFWSOdz4yhVraKfsohNAeiF0OnC1wCuPTB\nuNSY43BGAz/lHiTbvn7TK+41JlkCgYEA0SmFc99RKyGab+x4r38M4dHQyGfd2Kzy\nCVcdNVUe5Idnnu5OZCFN0ORMeoWZIuR8IeGj8vcCq/48215P9onoQEFrIo805Bw5\njX9XMToJVsg1hWznpqZm0mU/900VMOhJaeIAWvfTWiMIRgAy702hvt8zFf7duNhR\nOBQ8eqU/pEUCgYArHqJbT7SLXZiCfHUDgj3xwUTpY5JW/rQu/WIRJKEP6F3ZEjm/\njD6D2iWKDV5eQaVSBrJOQMSy5wRHzeBVIarhldwGq5joEehmhbSQiQuGx5UuXmzc\nhpv1dVhZCVDl0dNQei4tuYBi8DX3/T0NoQ3K/k3ZafI8sIMZ9BZ8G7frKQKBgQCM\n1chmHRgqUpYKhs88W+/wnbZXOpjGLK1MXLvuDUKf3gyHly5xfXtIDHDyjsJuHCr5\nJVWfY3MJHEcd7oMpHfKkUWgx/PtAHUEjZXrwSoO/S0++Z3YTYDgbstE/U0fRhpbo\nFKTom7ZUGwKXH8ssFrmyK9faF6JztDP77qRKcLpJgQKBgQCjBebFOW0TAQs8vhjS\nEsoDJ5J1Y7hTseFJ2sTLWfexHo3wXPC94cKsb65OFPoIaPFs5qOdf590unn7RpZP\nIl90M1J7jM+8xvUV3J2rCI3qejQZ0PF8uPvGs+NrSMc/eSicaHh5su+V7o4BGe3t\n0hdCNUBBY/Z2pJ5c9uijTEDL0A==\n-----END PRIVATE KEY-----\n',
  signingPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIO4b3u0fjjEMdDlT\nzxVOY0i7Hvf6g0JDByzkn0J/YuehRANCAASEbG0IWej3rPbxRmHDLWj8CE/ZzS0Y\n7BzuhVemjSBO1Iu1dZhY1+4KRak+rYlEb2rE5w91P69uTHl+YPAw5Ofa\n-----END PRIVATE KEY-----\n',
  verifier: {
    did: dummyVerifierDid,
    uuid: verifierUuid,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name: 'test verifier',
    customerUuid,
    url: 'https://verifier-api.demo.unum.id/presentation',
    isAuthorized: true
  }
};

export const dummyVerifierEntity = new VerifierEntity(dummyVerifierEntityOptions);

export const dummyVerifierResponseDto: VerifierResponseDto = {
  uuid: dummyVerifierEntity.uuid,
  createdAt: dummyVerifierEntity.createdAt,
  updatedAt: dummyVerifierEntity.updatedAt,
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  encryptionPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5vL6S1xkvQukL\nMvi9JoM1yqzp+sdyYVPzF1pTs/cJ+f2HDYTkfb5Jzlc5DElR5cYmPJYyDft0bD68\npZstjLkRZVEawgSvNglGiiN/N3NihvcvDg7kjfhcuOXSY1s+Y/sHl7EB50nBNrkW\nSzhreKrBsgG7DtgKZNuA/rleWK4JE8veUDYz9CLexkUw3p3JWhKx50lYxHV/iZto\n+iP4VfWyJ4YHW1pLFaG3MYnjvM46XBqCUCW4YOX0PHerNYukXx0EvndoxvFgXQwJ\nck/xlpCoaCxZFVv5HvkHSe6HstsQzImh2j1TTXxNCnGd1xaXeQIoUqQk/jW6DFEU\nEqcNy1n9AgMBAAECggEBAJwKsQTGh1cIXKdW/FhVCbjgfGLamENE93VsMivOLwaH\nqvKSbgpUhdCV9Pttkg+m/dDT589HpfDKm+57JyKebkDqILhdNfhJaoODvIy9dkfZ\nYcN7iRGFIJotkI8vf9Grx5M6YrBZssILinXrXgwURUkTlpajwucAktUNq4hS8muW\ncmNGVIlos4kJ36TL+wsyxS0MrdvghreMykG9Pbbhg/JL3civ43Dssl9YWomhZge2\n46cfiB4mf0eMyIEhNHCwqecSqz3IyZLoyifp1BO+SgPRs5MO7xt3gp/u1aQAQtg5\nZgLPhOWQJ0GLkbXG/cusSnPxV9tTF6WP9AYdEoK1RCECgYEA41Rci/9BcrryY6bx\nUOWwy/GOlWWAKobfJZMUyjP7kBUKrTHAJ6nL0U6ifPsrTQADCoYSWRG1pmlhsVXb\nnHM+ExXCb5Gb8vXbZK9GSoqDrB/Lu3TFWSOdz4yhVraKfsohNAeiF0OnC1wCuPTB\nuNSY43BGAz/lHiTbvn7TK+41JlkCgYEA0SmFc99RKyGab+x4r38M4dHQyGfd2Kzy\nCVcdNVUe5Idnnu5OZCFN0ORMeoWZIuR8IeGj8vcCq/48215P9onoQEFrIo805Bw5\njX9XMToJVsg1hWznpqZm0mU/900VMOhJaeIAWvfTWiMIRgAy702hvt8zFf7duNhR\nOBQ8eqU/pEUCgYArHqJbT7SLXZiCfHUDgj3xwUTpY5JW/rQu/WIRJKEP6F3ZEjm/\njD6D2iWKDV5eQaVSBrJOQMSy5wRHzeBVIarhldwGq5joEehmhbSQiQuGx5UuXmzc\nhpv1dVhZCVDl0dNQei4tuYBi8DX3/T0NoQ3K/k3ZafI8sIMZ9BZ8G7frKQKBgQCM\n1chmHRgqUpYKhs88W+/wnbZXOpjGLK1MXLvuDUKf3gyHly5xfXtIDHDyjsJuHCr5\nJVWfY3MJHEcd7oMpHfKkUWgx/PtAHUEjZXrwSoO/S0++Z3YTYDgbstE/U0fRhpbo\nFKTom7ZUGwKXH8ssFrmyK9faF6JztDP77qRKcLpJgQKBgQCjBebFOW0TAQs8vhjS\nEsoDJ5J1Y7hTseFJ2sTLWfexHo3wXPC94cKsb65OFPoIaPFs5qOdf590unn7RpZP\nIl90M1J7jM+8xvUV3J2rCI3qejQZ0PF8uPvGs+NrSMc/eSicaHh5su+V7o4BGe3t\n0hdCNUBBY/Z2pJ5c9uijTEDL0A==\n-----END PRIVATE KEY-----\n',
  signingPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIO4b3u0fjjEMdDlT\nzxVOY0i7Hvf6g0JDByzkn0J/YuehRANCAASEbG0IWej3rPbxRmHDLWj8CE/ZzS0Y\n7BzuhVemjSBO1Iu1dZhY1+4KRak+rYlEb2rE5w91P69uTHl+YPAw5Ofa\n-----END PRIVATE KEY-----\n',
  verifier: {
    did: dummyVerifierDid,
    uuid: verifierUuid,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name: 'test verifier',
    customerUuid,
    url: 'https://verifier-api.demo.unum.id/presentation',
    isAuthorized: true
  }
};

export const dummyPresentationRequestUuid = v4();
export const dummyVerifierDidWithHash = `${dummyVerifierDid}#${v4()}`;
export const dummyHolderAppUuid = v4();

export const dummySession = new Session({});

export const dummyPresentationRequestEntityOptions: PresentationRequestEntityOptions = {
  prUuid: dummyPresentationRequestUuid,
  prCreatedAt: now,
  prUpdatedAt: now,
  prExpiresAt: tenMinutesFromNow,
  prVerifier: dummyVerifierDid,
  prCredentialRequests: [{
    type: 'TestCredential',
    issuers: [dummyIssuerDid]
  }],
  prProof: {
    created: now.toISOString(),
    signatureValue: 'dummy signature value',
    unsignedValue: 'dummy unsigned value',
    type: 'secp256r1signature2020',
    verificationMethod: dummyVerifierDidWithHash,
    proofPurpose: 'assertionMethod'
  },
  prMetadata: { sessionUuid: dummySession.uuid },
  prHolderAppUuid: dummyHolderAppUuid,
  prVerifierInfo: {
    name: dummyVerifierEntityOptions.verifierName,
    did: dummyVerifierDid,
    url: dummyVerifierEntityOptions.verifierUrl
  },
  prIssuerInfo: {
    [dummyIssuerDid]: {
      did: dummyIssuerDid,
      name: 'test issuer'
    }
  },
  prDeeplink: `acme://unumid/presentationRequest/${dummyPresentationRequestUuid}`,
  prQrCode: 'data:image/png;base64,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'
};
export const dummyPresentationRequestEntity = new PresentationRequestEntity(dummyPresentationRequestEntityOptions);

export const dummyPresentationRequestPostDto: PresentationRequestPostDto = {
  presentationRequest: {
    uuid: dummyPresentationRequestUuid,
    createdAt: now,
    updatedAt: now,
    expiresAt: tenMinutesFromNow,
    verifier: dummyVerifierDid,
    credentialRequests: [{
      type: 'TestCredential',
      issuers: [dummyIssuerDid]
    }],
    proof: {
      created: now.toISOString(),
      signatureValue: 'dummy signature value',
      unsignedValue: 'dummy unsigned value',
      type: 'secp256r1signature2020',
      verificationMethod: dummyVerifierDidWithHash,
      proofPurpose: 'assertionMethod'
    },
    metadata: { sessionUuid: dummySession.uuid },
    holderAppUuid: dummyHolderAppUuid
  },
  verifier: {
    name: dummyVerifierEntityOptions.verifierName,
    did: dummyVerifierDid,
    url: dummyVerifierEntityOptions.verifierUrl
  },
  issuers: {
    [dummyIssuerDid]: {
      did: dummyIssuerDid,
      name: 'test issuer'
    }
  },
  deeplink: `acme://unumid/presentationRequest/${dummyPresentationRequestUuid}`,
  qrCode: 'data:image/png;base64,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'
};

export const dummyPresentationRequestResponseDto: DemoPresentationRequestDto = {
  presentationRequestPostDto: dummyPresentationRequestPostDto,
  uuid: dummyPresentationRequestEntity.uuid,
  createdAt: dummyPresentationRequestEntity.createdAt,
  updatedAt: dummyPresentationRequestEntity.updatedAt
};

const dummyCredential: Credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  credentialStatus: {
    id: 'https://api.dev-unumid.org//credentialStatus/9e90a492-3360-4beb-b3ca-e8eff1ec6e2a',
    type: 'CredentialStatus'
  },
  credentialSubject: {
    id: 'did:unum:54ca4b1f-fe7e-43ce-a4e4-8ec178f16a65',
    firstName: 'Wile',
    middleInitial: 'E.',
    lastName: 'Coyote',
    username: 'Central-value-added-908',
    ssn4: 4321,
    contactInformation: {
      emailAddress: 'AnvilAvoider@gmail.com',
      phoneNumber: '1234567890',
      homeAddress: {
        line1: '98765 Runner Rd.',
        city: 'Desert',
        state: 'AZ',
        zip: 12345,
        country: 'United States'
      }
    },
    driversLicense: {
      state: 'AZ',
      number: 'n-123456789',
      expiration: '2026-01-14T00:00:00.000Z'
    },
    accounts: {
      checking: {
        accountNumber: '543888430912',
        routingNumber: '021000021'
      }
    },
    confidence: '99%'
  },
  issuer: 'did:unum:2e05967f-216f-44c4-ae8e-d6f71cd17c5a',
  type: [
    'VerifiableCredential',
    'BankIdentityCredential'
  ],
  id: '9e90a492-3360-4beb-b3ca-e8eff1ec6e2a',
  issuanceDate: new Date('2021-02-08T21:18:23.403Z'),
  expirationDate: new Date('2022-02-08T00:00:00.000Z'),
  proof: {
    created: '2021-02-08T21:18:23.403Z',
    signatureValue: 'iKx1CJMheLAPr3H1T4TDH13h7xTVeunAhTy6ochNjxteHbb7X7J951idkvR8ZCxfvoz85JHwTpiNXFBYUB842UhWcTCS4JEhcf',
    unsignedValue: '{\'@context\':[\'https://www.w3.org/2018/credentials/v1\'],\'credentialStatus\':{\'id\':\'https://api.dev-unumid.org//credentialStatus/9e90a492-3360-4beb-b3ca-e8eff1ec6e2a\',\'type\':\'CredentialStatus\'},\'credentialSubject\':{\'accounts\':{\'checking\':{\'accountNumber\':\'543888430912\',\'routingNumber\':\'021000021\'}},\'confidence\':\'99%\',\'contactInformation\':{\'emailAddress\':\'AnvilAvoider@gmail.com\',\'homeAddress\':{\'city\':\'Desert\',\'country\':\'United States\',\'line1\':\'98765 Runner Rd.\',\'state\':\'AZ\',\'zip\':12345},\'phoneNumber\':\'1234567890\'},\'driversLicense\':{\'expiration\':\'2026-01-14T00:00:00.000Z\',\'number\':\'n-123456789\',\'state\':\'AZ\'},\'firstName\':\'Wile\',\'id\':\'did:unum:54ca4b1f-fe7e-43ce-a4e4-8ec178f16a65\',\'lastName\':\'Coyote\',\'middleInitial\':\'E.\',\'ssn4\':4321,\'username\':\'Central-value-added-908\'},\'expirationDate\':\'2022-02-08T00:00:00.000Z\',\'id\':\'9e90a492-3360-4beb-b3ca-e8eff1ec6e2a\',\'issuanceDate\':\'2021-02-08T21:18:23.403Z\',\'issuer\':\'did:unum:2e05967f-216f-44c4-ae8e-d6f71cd17c5a\',\'type\':[\'VerifiableCredential\',\'BankIdentityCredential\']}',
    type: 'secp256r1Signature2020',
    verificationMethod: 'did:unum:2e05967f-216f-44c4-ae8e-d6f71cd17c5a',
    proofPurpose: 'AssertionMethod'
  }
};

export const dummyPresentation: Presentation = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  presentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
  proof: {
    created: '2021-02-22T11:36:34.113-0800',
    proofPurpose: 'Presentations',
    signatureValue: '381yXZEx4Z3tfBztX1o6xHbkqRija3svPYfTygUfK6uh8dHjeexaCq7nNvW17Sedd9Y93BJ9HsT17RtsCQ6NfFQomSF4pyx5',
    unsignedValue: '{"@context":["https://www.w3.org/2018/credentials/v1"],"presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["VerifiablePresentation"],"uuid":"e0d0951a-190c-4dcb-9655-092012b7f265","verifiableCredential":[{"@context":["https://www.w3.org/2018/credentials/v1"],"credentialStatus":{"id":"https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98","type":"CredentialStatus"},"credentialSubject":{"accounts":{"checking":{"accountNumber":"543888430912","routingNumber":"021000021"}},"confidence":"99%","contactInformation":{"emailAddress":"AnvilAvoider@gmail.com","homeAddress":{"city":"Desert","country":"United States","line1":"98765 Runner Rd.","state":"AZ","zip":12345},"phoneNumber":"1234567890"},"driversLicense":{"expiration":"2026-01-14T00:00:00.000Z","number":"n-123456789","state":"AZ"},"firstName":"Wile","id":"did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7","lastName":"Coyote","middleInitial":"E.","ssn4":4321,"username":"state-Montana-211"},"expirationDate":"2022-02-11T00:00:00.000Z","id":"d90b1bac-4805-410b-b81f-10b96fea8e98","issuanceDate":"2021-02-11T22:23:05.590Z","issuer":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae","proof":{"created":"2021-02-11T22:23:05.590Z","proofPurpose":"AssertionMethod","signatureValue":"iKx1CJPw1Yog6jfUhEtzasgP3gC8AKzc9L4GXh3Zox8AYLjymu83P5SPsw4zx2JuVy7PXWYakgbDUdgS5CvH22rNcF2N9tYQ4b","type":"secp256r1Signature2020","verificationMethod":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae"},"type":["VerifiableCredential","BankIdentityCredential"]}]}',
    type: 'secp256r1Signature2020',
    verificationMethod: 'did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7#5ab4997a-73c2-498a-b6f1-53a6787cfd22'
  },
  type: [
    'VerifiablePresentation'
  ],
  uuid: 'e0d0951a-190c-4dcb-9655-092012b7f265',
  verifiableCredential: [
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1'
      ],
      credentialStatus: {
        id: 'https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98',
        type: 'CredentialStatus'
      },
      credentialSubject: {
        accounts: {
          checking: {
            accountNumber: '543888430912',
            routingNumber: '021000021'
          }
        },
        confidence: '99%',
        contactInformation: {
          emailAddress: 'AnvilAvoider@gmail.com',
          homeAddress: {
            city: 'Desert',
            country: 'United States',
            line1: '98765 Runner Rd.',
            state: 'AZ',
            zip: 12345
          },
          phoneNumber: '1234567890'
        },
        driversLicense: {
          expiration: '2026-01-14T00:00:00.000Z',
          number: 'n-123456789',
          state: 'AZ'
        },
        firstName: 'Wile',
        id: 'did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7',
        lastName: 'Coyote',
        middleInitial: 'E.',
        ssn4: 4321,
        username: 'state-Montana-211'
      },
      expirationDate: new Date('2022-02-11T00:00:00.000Z'),
      id: 'd90b1bac-4805-410b-b81f-10b96fea8e98',
      issuanceDate: new Date('2021-02-11T22:23:05.590Z'),
      issuer: 'did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae',
      proof: {
        created: '2021-02-11T22:23:05.590Z',
        proofPurpose: 'AssertionMethod',
        signatureValue: 'iKx1CJPw1Yog6jfUhEtzasgP3gC8AKzc9L4GXh3Zox8AYLjymu83P5SPsw4zx2JuVy7PXWYakgbDUdgS5CvH22rNcF2N9tYQ4b',
        unsignedValue: '{"@context":["https://www.w3.org/2018/credentials/v1"],"credentialStatus":{"id":"https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98","type":"CredentialStatus"},"credentialSubject":{"accounts":{"checking":{"accountNumber":"543888430912","routingNumber":"021000021"}},"confidence":"99%","contactInformation":{"emailAddress":"AnvilAvoider@gmail.com","homeAddress":{"city":"Desert","country":"United States","line1":"98765 Runner Rd.","state":"AZ","zip":12345},"phoneNumber":"1234567890"},"driversLicense":{"expiration":"2026-01-14T00:00:00.000Z","number":"n-123456789","state":"AZ"},"firstName":"Wile","id":"did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7","lastName":"Coyote","middleInitial":"E.","ssn4":4321,"username":"state-Montana-211"},"expirationDate":"2022-02-11T00:00:00.000Z","id":"d90b1bac-4805-410b-b81f-10b96fea8e98","issuanceDate":"2021-02-11T22:23:05.590Z","issuer":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae","type":["VerifiableCredential","BankIdentityCredential"]}',
        type: 'secp256r1Signature2020',
        verificationMethod: 'did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae'
      },
      type: [
        'VerifiableCredential',
        'BankIdentityCredential'
      ]
    }
  ]
};

export const dummyPresentationWithVerification: PresentationWithVerification = {
  presentation: dummyPresentation,
  isVerified: true
};

export const dummyPresentationEntityOptions: PresentationEntityOptions = {
  presentationContext: [
    'https://www.w3.org/2018/credentials/v1'
  ],
  presentationPresentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
  presentationProof: {
    created: '2021-02-22T11:36:34.113-0800',
    proofPurpose: 'Presentations',
    signatureValue: '381yXZEx4Z3tfBztX1o6xHbkqRija3svPYfTygUfK6uh8dHjeexaCq7nNvW17Sedd9Y93BJ9HsT17RtsCQ6NfFQomSF4pyx5',
    unsignedValue: '{"@context":["https://www.w3.org/2018/credentials/v1"],"presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["VerifiablePresentation"],"uuid":"e0d0951a-190c-4dcb-9655-092012b7f265","verifiableCredential":[{"@context":["https://www.w3.org/2018/credentials/v1"],"credentialStatus":{"id":"https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98","type":"CredentialStatus"},"credentialSubject":{"accounts":{"checking":{"accountNumber":"543888430912","routingNumber":"021000021"}},"confidence":"99%","contactInformation":{"emailAddress":"AnvilAvoider@gmail.com","homeAddress":{"city":"Desert","country":"United States","line1":"98765 Runner Rd.","state":"AZ","zip":12345},"phoneNumber":"1234567890"},"driversLicense":{"expiration":"2026-01-14T00:00:00.000Z","number":"n-123456789","state":"AZ"},"firstName":"Wile","id":"did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7","lastName":"Coyote","middleInitial":"E.","ssn4":4321,"username":"state-Montana-211"},"expirationDate":"2022-02-11T00:00:00.000Z","id":"d90b1bac-4805-410b-b81f-10b96fea8e98","issuanceDate":"2021-02-11T22:23:05.590Z","issuer":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae","proof":{"created":"2021-02-11T22:23:05.590Z","proofPurpose":"AssertionMethod","signatureValue":"iKx1CJPw1Yog6jfUhEtzasgP3gC8AKzc9L4GXh3Zox8AYLjymu83P5SPsw4zx2JuVy7PXWYakgbDUdgS5CvH22rNcF2N9tYQ4b","type":"secp256r1Signature2020","verificationMethod":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae"},"type":["VerifiableCredential","BankIdentityCredential"]}]}',
    type: 'secp256r1Signature2020',
    verificationMethod: 'did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7#5ab4997a-73c2-498a-b6f1-53a6787cfd22'
  },
  presentationType: [
    'VerifiablePresentation'
  ],
  presentationUuid: 'e0d0951a-190c-4dcb-9655-092012b7f265',
  presentationVerifiableCredential: [
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1'
      ],
      credentialStatus: {
        id: 'https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98',
        type: 'CredentialStatus'
      },
      credentialSubject: {
        accounts: {
          checking: {
            accountNumber: '543888430912',
            routingNumber: '021000021'
          }
        },
        confidence: '99%',
        contactInformation: {
          emailAddress: 'AnvilAvoider@gmail.com',
          homeAddress: {
            city: 'Desert',
            country: 'United States',
            line1: '98765 Runner Rd.',
            state: 'AZ',
            zip: 12345
          },
          phoneNumber: '1234567890'
        },
        driversLicense: {
          expiration: '2026-01-14T00:00:00.000Z',
          number: 'n-123456789',
          state: 'AZ'
        },
        firstName: 'Wile',
        id: 'did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7',
        lastName: 'Coyote',
        middleInitial: 'E.',
        ssn4: 4321,
        username: 'state-Montana-211'
      },
      expirationDate: new Date('2022-02-11T00:00:00.000Z'),
      id: 'd90b1bac-4805-410b-b81f-10b96fea8e98',
      issuanceDate: new Date('2021-02-11T22:23:05.590Z'),
      issuer: 'did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae',
      proof: {
        created: '2021-02-11T22:23:05.590Z',
        proofPurpose: 'AssertionMethod',
        signatureValue: 'iKx1CJPw1Yog6jfUhEtzasgP3gC8AKzc9L4GXh3Zox8AYLjymu83P5SPsw4zx2JuVy7PXWYakgbDUdgS5CvH22rNcF2N9tYQ4b',
        unsignedValue: '{"@context":["https://www.w3.org/2018/credentials/v1"],"credentialStatus":{"id":"https://api.sandbox-unumid.org//credentialStatus/d90b1bac-4805-410b-b81f-10b96fea8e98","type":"CredentialStatus"},"credentialSubject":{"accounts":{"checking":{"accountNumber":"543888430912","routingNumber":"021000021"}},"confidence":"99%","contactInformation":{"emailAddress":"AnvilAvoider@gmail.com","homeAddress":{"city":"Desert","country":"United States","line1":"98765 Runner Rd.","state":"AZ","zip":12345},"phoneNumber":"1234567890"},"driversLicense":{"expiration":"2026-01-14T00:00:00.000Z","number":"n-123456789","state":"AZ"},"firstName":"Wile","id":"did:unum:8de4666d-9692-4762-a015-0b8b1f8e08f7","lastName":"Coyote","middleInitial":"E.","ssn4":4321,"username":"state-Montana-211"},"expirationDate":"2022-02-11T00:00:00.000Z","id":"d90b1bac-4805-410b-b81f-10b96fea8e98","issuanceDate":"2021-02-11T22:23:05.590Z","issuer":"did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae","type":["VerifiableCredential","BankIdentityCredential"]}',
        type: 'secp256r1Signature2020',
        verificationMethod: 'did:unum:de9523d0-b97e-466c-80f4-ae312dd091ae'
      },
      type: [
        'VerifiableCredential',
        'BankIdentityCredential'
      ]
    }
  ],
  isVerified: true
};

export const dummyPresentationEntity = new PresentationEntity(dummyPresentationEntityOptions);

export const dummyPresentationResponseDto: DemoPresentationDto = {
  uuid: dummyPresentationEntity.uuid,
  createdAt: dummyPresentationEntity.createdAt,
  updatedAt: dummyPresentationEntity.updatedAt,
  presentation: dummyPresentationWithVerification.presentation,
  isVerified: dummyPresentationWithVerification.isVerified
};

export const dummyNoPresentation: NoPresentation = {
  holder: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
  presentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
  type: ['NoPresentation', 'NoPresentation'],
  proof: {
    created: '2021-02-22T21:30:03.377Z',
    signatureValue: 'AN1rKvszAWeMwUW7ghrEG9BfWr7a5n9kWpvqQrW5bQKM9sCS4KDmiwX6PZidMNcYRTvwQ9RLyHELQu33TbcUPVwWEqE23wJHs',
    unsignedValue: '{"holder":"did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03","presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["NoPresentation","NoPresentation"]}',
    type: 'secp256r1Signature2020',
    verificationMethod: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
    proofPurpose: 'assertionMethod'
  }
};

export const dummyNoPresentationWithVerification: NoPresentationWithVerification = {
  noPresentation: dummyNoPresentation,
  isVerified: true
};

export const dummyNoPresentationEntityOptions: NoPresentationEntityOptions = {
  npHolder: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
  npPresentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
  npType: ['NoPresentation', 'NoPresentation'],
  npProof: {
    created: '2021-02-22T21:30:03.377Z',
    signatureValue: 'AN1rKvszAWeMwUW7ghrEG9BfWr7a5n9kWpvqQrW5bQKM9sCS4KDmiwX6PZidMNcYRTvwQ9RLyHELQu33TbcUPVwWEqE23wJHs',
    unsignedValue: '{"holder":"did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03","presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["NoPresentation","NoPresentation"]}',
    type: 'secp256r1Signature2020',
    verificationMethod: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
    proofPurpose: 'assertionMethod'
  },
  isVerified: true
};

export const dummyNoPresentationEntity = new NoPresentationEntity(dummyNoPresentationEntityOptions);

export const dummyNoPresentationResponseDto: DemoNoPresentationDto = {
  uuid: dummyNoPresentationEntity.uuid,
  createdAt: dummyNoPresentationEntity.createdAt,
  updatedAt: dummyNoPresentationEntity.updatedAt,
  noPresentation: dummyNoPresentation,
  isVerified: dummyNoPresentationWithVerification.isVerified
};

export const dummyVerifierRegistrationResponse = {
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  body: {
    uuid: verifierUuid,
    customerUuid,
    did: dummyVerifierDid,
    name: dummyVerifierEntity.verifierName,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    isAuthorized: true,
    keys: {
      encryption: {
        privateKey: dummyVerifierEntityOptions.encryptionPrivateKey
      },
      signing: {
        privateKey: dummyVerifierEntityOptions.signingPrivateKey
      }
    }
  }
};

export const dummyPresentationVerificationResponse = {
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  body: { isVerified: true }
};

export const dummyNoPresentationVerificationResponse = {
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  body: { isVerified: true }
};
