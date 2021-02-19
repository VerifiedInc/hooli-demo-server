import { v4 } from 'uuid';

import { VerifierEntityOptions } from '../src/entities/Verifier';
import { PresentationRequestEntityOptions } from '../src/entities/PresentationRequest';

export const dummyVerifierDid = `did:unum:${v4()}`;
export const dummyIssuerDid = `did:unum:${v4()}`;
export const now = new Date();
const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

export const dummyVerifierEntityOptions: VerifierEntityOptions = {
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0',
  encryptionPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5vL6S1xkvQukL\nMvi9JoM1yqzp+sdyYVPzF1pTs/cJ+f2HDYTkfb5Jzlc5DElR5cYmPJYyDft0bD68\npZstjLkRZVEawgSvNglGiiN/N3NihvcvDg7kjfhcuOXSY1s+Y/sHl7EB50nBNrkW\nSzhreKrBsgG7DtgKZNuA/rleWK4JE8veUDYz9CLexkUw3p3JWhKx50lYxHV/iZto\n+iP4VfWyJ4YHW1pLFaG3MYnjvM46XBqCUCW4YOX0PHerNYukXx0EvndoxvFgXQwJ\nck/xlpCoaCxZFVv5HvkHSe6HstsQzImh2j1TTXxNCnGd1xaXeQIoUqQk/jW6DFEU\nEqcNy1n9AgMBAAECggEBAJwKsQTGh1cIXKdW/FhVCbjgfGLamENE93VsMivOLwaH\nqvKSbgpUhdCV9Pttkg+m/dDT589HpfDKm+57JyKebkDqILhdNfhJaoODvIy9dkfZ\nYcN7iRGFIJotkI8vf9Grx5M6YrBZssILinXrXgwURUkTlpajwucAktUNq4hS8muW\ncmNGVIlos4kJ36TL+wsyxS0MrdvghreMykG9Pbbhg/JL3civ43Dssl9YWomhZge2\n46cfiB4mf0eMyIEhNHCwqecSqz3IyZLoyifp1BO+SgPRs5MO7xt3gp/u1aQAQtg5\nZgLPhOWQJ0GLkbXG/cusSnPxV9tTF6WP9AYdEoK1RCECgYEA41Rci/9BcrryY6bx\nUOWwy/GOlWWAKobfJZMUyjP7kBUKrTHAJ6nL0U6ifPsrTQADCoYSWRG1pmlhsVXb\nnHM+ExXCb5Gb8vXbZK9GSoqDrB/Lu3TFWSOdz4yhVraKfsohNAeiF0OnC1wCuPTB\nuNSY43BGAz/lHiTbvn7TK+41JlkCgYEA0SmFc99RKyGab+x4r38M4dHQyGfd2Kzy\nCVcdNVUe5Idnnu5OZCFN0ORMeoWZIuR8IeGj8vcCq/48215P9onoQEFrIo805Bw5\njX9XMToJVsg1hWznpqZm0mU/900VMOhJaeIAWvfTWiMIRgAy702hvt8zFf7duNhR\nOBQ8eqU/pEUCgYArHqJbT7SLXZiCfHUDgj3xwUTpY5JW/rQu/WIRJKEP6F3ZEjm/\njD6D2iWKDV5eQaVSBrJOQMSy5wRHzeBVIarhldwGq5joEehmhbSQiQuGx5UuXmzc\nhpv1dVhZCVDl0dNQei4tuYBi8DX3/T0NoQ3K/k3ZafI8sIMZ9BZ8G7frKQKBgQCM\n1chmHRgqUpYKhs88W+/wnbZXOpjGLK1MXLvuDUKf3gyHly5xfXtIDHDyjsJuHCr5\nJVWfY3MJHEcd7oMpHfKkUWgx/PtAHUEjZXrwSoO/S0++Z3YTYDgbstE/U0fRhpbo\nFKTom7ZUGwKXH8ssFrmyK9faF6JztDP77qRKcLpJgQKBgQCjBebFOW0TAQs8vhjS\nEsoDJ5J1Y7hTseFJ2sTLWfexHo3wXPC94cKsb65OFPoIaPFs5qOdf590unn7RpZP\nIl90M1J7jM+8xvUV3J2rCI3qejQZ0PF8uPvGs+NrSMc/eSicaHh5su+V7o4BGe3t\n0hdCNUBBY/Z2pJ5c9uijTEDL0A==\n-----END PRIVATE KEY-----\n',
  signingPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIO4b3u0fjjEMdDlT\nzxVOY0i7Hvf6g0JDByzkn0J/YuehRANCAASEbG0IWej3rPbxRmHDLWj8CE/ZzS0Y\n7BzuhVemjSBO1Iu1dZhY1+4KRak+rYlEb2rE5w91P69uTHl+YPAw5Ofa\n-----END PRIVATE KEY-----\n',
  verifierDid: dummyVerifierDid,
  verifierUuid: v4(),
  verifierCreatedAt: now,
  verifierUpdatedAt: now,
  verifierName: 'test verifier',
  verifierCustomerUuid: v4(),
  verifierUrl: 'http://verifier-api.demo.unum.id',
  verifierIsAuthorized: true
};

export const dummyPresentationRequestUuid = v4();
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
    verificationMethod: `${dummyVerifierDid}#${v4()}`,
    proofPurpose: 'assertionMethod'
  },
  prMetadata: {},
  prHolderAppUuid: v4(),
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
