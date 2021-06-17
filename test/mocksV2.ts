import fs from 'fs';
import path from 'path';

import { stringify, v4 } from 'uuid';
import {
  Credential,
  Presentation,
  PresentationRequestPostDto,
  UnsignedPresentation,
  Proof,
  PresentationRequestDto,
  EncryptedPresentation,
  WithVersion
} from '@unumid/types-deprecated-v2';
import { encrypt } from '@unumid/library-crypto';

import { VerifierEntityOptions, VerifierEntity } from '../src/entities/Verifier';
import { PresentationRequestEntity, PresentationRequestEntityOptions } from '../src/entities/PresentationRequest';
import { Session } from '../src/entities/Session';
import { PresentationEntityOptions, PresentationEntity } from '../src/entities/Presentation';
import { NoPresentationEntity, NoPresentationEntityOptions } from '../src/entities/NoPresentation';
import { VerifierRequestDto, VerifierResponseDto } from '../src/services/api/verifier/verifier.class';
import {
  PresentationWithVerificationDeprecated,
  NoPresentationWithVerificationDeprecated
} from '../src/services/api/presentation/presentation.class';
import { DemoPresentationDto, DemoPresentationRequestDto } from '@unumid/demo-types';
import { DecryptedPresentation, UnumDto, createProof } from '@unumid/server-sdk-deprecated-v2';
import { CredentialSubject } from '@unumid/server-sdk-deprecated-v1';
import { DemoNoPresentationDto } from '@unumid/demo-types-deprecated-v1';

// export const dummyVerifierDid = `did:unum:${v4()}`;
export const dummyVerifierDid = 'did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8';
export const dummyIssuerDid = `did:unum:${v4()}`;
export const now = new Date();
const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

const verifierUuid = v4();
export const customerUuid = v4();

export const rsaPublicKeyPem =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtaMEiAnqi7t+fQX1WjYY\ngcjvAL6ThYaUwJmGqXPS8PwbWr8aIDgV/BrxwmK8sZphHtzdN7TTcIRHDiwGJ2A6\n0SPrfr6WoVywoKLxOV+qw+4P/n6Ek3QEBTKCe6Mk1aUaMSOymsD/5Cu6XWHWKWed\nSI8eaU0/hMNa7Bs5bABO7VMBGYdlFzfdqjNClJY8XwkclHit1Axr4P6qkaOeNZcn\nFy9ek95Y8w8Z/44Qm3V7GDofmqhzDqlxkFzcNeyNrfpBBQPjSURMcd9lekc0VM4S\nn335EnqgdVhHSiczpxh4Vr7OI8mkTw00S8fgw+g2pgJBBzJhdGY7X9mOEFOp+wZT\nuwIDAQAB\n-----END PUBLIC KEY-----\n';
export const rsaPrivateKeyPem =
  '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1owSICeqLu359\nBfVaNhiByO8AvpOFhpTAmYapc9Lw/BtavxogOBX8GvHCYryxmmEe3N03tNNwhEcO\nLAYnYDrRI+t+vpahXLCgovE5X6rD7g/+foSTdAQFMoJ7oyTVpRoxI7KawP/kK7pd\nYdYpZ51Ijx5pTT+Ew1rsGzlsAE7tUwEZh2UXN92qM0KUljxfCRyUeK3UDGvg/qqR\no541lycXL16T3ljzDxn/jhCbdXsYOh+aqHMOqXGQXNw17I2t+kEFA+NJRExx32V6\nRzRUzhKfffkSeqB1WEdKJzOnGHhWvs4jyaRPDTRLx+DD6DamAkEHMmF0Zjtf2Y4Q\nU6n7BlO7AgMBAAECggEALmO+Koht0NZIDeJRsYKTa8JH2GbUAoxGvZH4ZJriSw34\nZorcP1JTuxmemUjibHHDUECUdz/FqLz/8MypnbDkFLoZ0TsX+YpUyhITjdWzJWtN\nxm/FqGs/A5zM2ormQ3JxaA939DJKqJnKdUMhkV2XPArhd391M5E5TYf+eGjzv4S/\nGwmo4xtrqCYbXEPlIv5dI9Rj2RF7rd5iSHDYdavKv1MJi55zuyO+wt2GqWPLGgBC\nyyVVEd6Irm/AiFsYWjWHm44ChKarUi1hJj1qyTZV90/xuhYwam+A40rSqjlbRqPf\neFH94IZKtKQlDkQH61vK/B1Pmud0AmWRHiSmPB58oQKBgQDnpCHx2nPg2LgSN5vL\nTp+9a4DO5uenYbgaK3WQMhc+4kv/LME297M1GKVqcpLGK9cfQ4sfn5tlMRRUta51\nfLGNI4NwqdhfGZE86EkUIAWcTbBOvsb5z3RbEDpajUZAYmBL26OFZo1E3YfMBsXl\n1dZvbuc20wFSLKMSe6siPBvAqQKBgQDIvL+4PA6spqEoUAUYhpW5TZcvBE9OOBgJ\nJvcx2y3sA14k2GKcSIM7tFc0ibFrkuxlM5lFAgqdKoKx5VCHZPs5K+Z2Ebb+P2z4\n05j7jQPwnrx9LVBSD0Vb/JFjKfjMjm3FbAHuS1SaMfoRNvv8FzvnQN2R9QIvnk/J\njoNzVMLbwwKBgFEJI3LnmGhNiL+ewpryS4HJrQs0zk/JKM3G7F7gly9BnZKMhp+D\nMideEuhVYrF/PsfKKk6K2KMi81jbIkgpsjeM9/ue/3ntiNjE7mPi+/N9XjN+HD/i\nanM9Dx0ElVIK2GNRWDhf8wXndg1TRUItd9IN+0c7tBeaVAYwS2MzogXZAoGAH0N+\nXJRF+M/O47dqw8IaSYzzEeiK7XTBEZPXBhXL1ilEHVryKMMGZWMV/eHAFy//z1c0\n9NF3k7jOOCSt4RhyJBpZP2RM6tY4A5z5A5yX0371fk1zaARm2gfBIP+ldz5rjEbh\nGhrzZzyHZOz6W+3Gb6Ljn1rYZ1AxvwOKJ4k4+/8CgYAjVjEkqZMchTC4mB3uHoOF\nB6VOHeoGxg+kJlL54xk7SzXTfHZ9oBofe5drKkOSOEgbrM/Ts+woZAN8LdIBZJ+t\nrUyVxZvdzD1dddOXTqM6mLkJMLOsM869TKQAdAn50o8fvZ5N/fQnr+9HzA3zqpPl\n8882IUPXaf9nOIA0rpUPWg==\n-----END PRIVATE KEY-----\n';
export const eccPublicKeyPem =
  '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEP2aZD4I5ojwnIBsInS6aTCMcLpF7\npzGh1C5bePWDJ5HB/c9CammU0IF999Q6Iy+wOdBHnM2fYgKqOOvHa9wxNQ==\n-----END PUBLIC KEY-----\n';
export const eccPrivateKeyPem =
  '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0TIRCXT1FF+w76Zm\n4z95ieOIhKOLM3a6MMjprvx7GryhRANCAAQ/ZpkPgjmiPCcgGwidLppMIxwukXun\nMaHULlt49YMnkcH9z0JqaZTQgX331DojL7A50EeczZ9iAqo468dr3DE1\n-----END PRIVATE KEY-----\n';

export const dummyAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmVyaWZpZXIiLCJ1dWlkIjoiZTMzNjQ0NTMtZmY1OS00NGI5LWJiOWEtY2I0NGQzODMzMDQ3IiwiZGlkIjoiZGlkOnVudW06NjI2MWFlYmUtZWI2NC00NzUwLTg0NTEtYjQwZTg1ZGU4ZWViIiwiZXhwIjoxNjEzNjkyMTA4LjgxNywiaWF0IjoxNjEzNjkzMTU2fQ.r5ucRkp7gZtWmko8D-7EzhnOhPNNlv_5-RdaVMRmnl0';

export const mockCredentialStatus = {
  authToken: dummyAuthToken,
  body: true
};

export const mockDidDoc = {
  headers: {},
  body: {
    '@context': [
      'https://www.w3.org/ns/did/v1'
    ],
    id: 'did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8',
    created: '2020-09-03T18:34:38.444Z',
    updated: '2020-09-03T18:34:38.444Z',
    publicKey: [
      {
        id: '1e126861-a51b-491f-9206-e2c6b8639fd1',
        type: 'secp256r1',
        status: 'valid',
        encoding: 'pem',
        publicKey: eccPublicKeyPem
      },
      {
        id: '2386ef83-139c-439f-a0ce-f34dd4b5db0c',
        type: 'RSA',
        status: 'valid',
        encoding: 'pem',
        publicKey: rsaPublicKeyPem
      }
    ],
    service: [
      {
        id: 'did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8#vcr',
        type: 'CredentialRepositoryService',
        serviceEndpoint: 'https://api.dev-unumid.org/credentialRepository/did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8'
      }
    ]
  }
};

export const dummyVerifierEntityOptions: VerifierEntityOptions = {
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: dummyAuthToken,
  encryptionPrivateKey: rsaPrivateKeyPem,
  signingPrivateKey: eccPrivateKeyPem,
  verifierDid: dummyVerifierDid,
  verifierUuid: verifierUuid,
  verifierCreatedAt: now,
  verifierUpdatedAt: now,
  verifierName: 'test verifier',
  verifierCustomerUuid: customerUuid,
  verifierUrl: 'https://verifier-api.demo.unum.id/presentation',
  verifierIsAuthorized: true,
  verifierVersionInfo: [{ target: { version: '2.0.0' }, sdkVersion: '2.0.0' }]
};

export const dummyVerifierRequestDto: VerifierRequestDto = {
  apiKey: 'VivPO5o37AXK8pcbMh7Kzm5XH02YiCVw1KQ60ozJX3k=',
  authToken: dummyAuthToken,
  encryptionPrivateKey: rsaPrivateKeyPem,
  signingPrivateKey: eccPrivateKeyPem,
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
  authToken: dummyAuthToken,
  encryptionPrivateKey: rsaPrivateKeyPem,
  signingPrivateKey: eccPrivateKeyPem,
  verifier: {
    did: dummyVerifierDid,
    uuid: verifierUuid,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name: 'test verifier',
    customerUuid,
    url: 'https://verifier-api.demo.unum.id/presentation',
    isAuthorized: true,
    versionInfo: []
  }
};

export const dummyPresentationRequestUuid = v4();
export const dummyPresentationRequestId = v4();
export const dummyVerifierDidWithHash = `${dummyVerifierDid}#${v4()}`;
export const dummyHolderAppUuid = v4();

const img = fs.readFileSync(path.join(__dirname, './mocks/verify-with-acme-button.png'));
export const dummyHolderAppInfo = {
  name: 'ACME',
  uriScheme: 'acme://',
  deeplinkButtonImg: `data:image/png;base64,${img.toString('base64')}`
};

export const dummySession = new Session({});

export const dummyPresentationRequestEntityOptions: PresentationRequestEntityOptions = {
  prUuid: dummyPresentationRequestUuid,
  prId: dummyPresentationRequestId,
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
  prHolderAppInfo: dummyHolderAppInfo,
  prDeeplink: `acme://unumid/presentationRequest/${dummyPresentationRequestUuid}`,
  prQrCode: 'data:image/png;base64,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'
};
export const dummyPresentationRequestEntity = new PresentationRequestEntity(dummyPresentationRequestEntityOptions);

export const dummyPresentationRequestPostDto: PresentationRequestPostDto = {
  presentationRequest: {
    uuid: dummyPresentationRequestUuid,
    id: dummyPresentationRequestId,
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
  holderApp: dummyHolderAppInfo,
  deeplink: `acme://unumid/presentationRequest/${dummyPresentationRequestUuid}`,
  qrCode: 'data:image/png;base64,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'
};

export const dummyPresentationRequestResponseDto: DemoPresentationRequestDto = {
  presentationRequestPostDto: dummyPresentationRequestPostDto,
  uuid: dummyPresentationRequestEntity.uuid,
  createdAt: dummyPresentationRequestEntity.createdAt,
  updatedAt: dummyPresentationRequestEntity.updatedAt
};

const dummyCredentialSubject: CredentialSubject = {
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
};

const dummyCredential: Credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  credentialStatus: {
    id: 'https://api.dev-unumid.org//credentialStatus/9e90a492-3360-4beb-b3ca-e8eff1ec6e2a',
    type: 'CredentialStatus'
  },
  credentialSubject: JSON.stringify(dummyCredentialSubject),
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

export const dummyPresentationUnsigned: UnsignedPresentation = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  type: [
    'VerifiablePresentation'
  ],
  presentationRequestUuid: dummyPresentationRequestUuid,
  presentationRequestId: dummyPresentationRequestId,
  verifierDid: dummyVerifierDid,
  verifiableCredential: [
    dummyCredential
  ]
};

const presProof: Proof = createProof(dummyPresentationUnsigned, eccPrivateKeyPem, 'did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8#1e126861-a51b-491f-9206-e2c6b8639fd1', 'pem');
export const dummyPresentation: Presentation = {
  ...dummyPresentationUnsigned,
  proof: presProof
};

export const dummyDeclinedPresentationUnsigned: UnsignedPresentation = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  type: [
    'VerifiablePresentation'
  ],
  presentationRequestUuid: dummyPresentationRequestUuid,
  presentationRequestId: dummyPresentationRequestId,
  verifierDid: dummyVerifierDid,
  verifiableCredential: [
    dummyCredential
  ]
};

const presDeclinedProof: Proof = createProof(dummyPresentationUnsigned, eccPrivateKeyPem, 'did:unum:3ff2f020-50b0-4f4c-a267-a9f104aedcd8#1e126861-a51b-491f-9206-e2c6b8639fd1', 'pem');
export const dummyDeclinedPresentation: Presentation = {
  ...dummyPresentationUnsigned,
  proof: presDeclinedProof
};

export const dummyPresentationRequestInfo: PresentationRequestDto = dummyPresentationRequestPostDto;

export const dummyEncryptedPresentationData = encrypt(dummyVerifierDid, rsaPublicKeyPem, dummyPresentation, 'pem');
export const dummyEncryptedPresentation: WithVersion<EncryptedPresentation> = {
  presentationRequestInfo: dummyPresentationRequestInfo,
  encryptedPresentation: dummyEncryptedPresentationData,
  version: '2.0.0'
};
// export const dummyEncryptedPresentationWithoutVersion: EncryptedPresentation = {
//   presentationRequestInfo: dummyPresentationRequestInfo,
//   encryptedPresentation: dummyEncryptedPresentationData
// };
export const dummyPresentationWithVerification: PresentationWithVerificationDeprecated = {
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
  verifierDid: 'did',
  presentationVerifiableCredentials: [
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

// export const dummyNoPresentation: NoPresentation = {
//   holder: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
//   presentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
//   type: ['NoPresentation', 'NoPresentation'],
//   proof: {
//     created: '2021-02-22T21:30:03.377Z',
//     signatureValue: 'AN1rKvszAWeMwUW7ghrEG9BfWr7a5n9kWpvqQrW5bQKM9sCS4KDmiwX6PZidMNcYRTvwQ9RLyHELQu33TbcUPVwWEqE23wJHs',
//     unsignedValue: '{"holder":"did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03","presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["NoPresentation","NoPresentation"]}',
//     type: 'secp256r1Signature2020',
//     verificationMethod: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
//     proofPurpose: 'assertionMethod'
//   }
// };

// export const dummyNoPresentationWithVerification: NoPresentationWithVerificationDeprecated = {
//   noPresentation: dummyNoPresentation,
//   isVerified: true
// };

// export const dummyNoPresentationEntityOptions: NoPresentationEntityOptions = {
//   npHolder: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
//   npPresentationRequestUuid: '256e9461-4b65-4941-a6cd-e379276a45b4',
//   npType: ['NoPresentation', 'NoPresentation'],
//   npProof: {
//     created: '2021-02-22T21:30:03.377Z',
//     signatureValue: 'AN1rKvszAWeMwUW7ghrEG9BfWr7a5n9kWpvqQrW5bQKM9sCS4KDmiwX6PZidMNcYRTvwQ9RLyHELQu33TbcUPVwWEqE23wJHs',
//     unsignedValue: '{"holder":"did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03","presentationRequestUuid":"256e9461-4b65-4941-a6cd-e379276a45b4","type":["NoPresentation","NoPresentation"]}',
//     type: 'secp256r1Signature2020',
//     verificationMethod: 'did:unum:5b329cd1-4832-448c-8d7d-08f49e3c6c6d#bab80ad2-08ad-44e7-8549-3d10dd6f7c03',
//     proofPurpose: 'assertionMethod'
//   },
//   isVerified: true
// };

// export const dummyNoPresentationEntity = new NoPresentationEntity(dummyNoPresentationEntityOptions);

// export const dummyNoPresentationResponseDto: DemoNoPresentationDto = {
//   uuid: dummyNoPresentationEntity.uuid,
//   createdAt: dummyNoPresentationEntity.createdAt,
//   updatedAt: dummyNoPresentationEntity.updatedAt,
//   noPresentation: dummyNoPresentation,
//   isVerified: dummyNoPresentationWithVerification.isVerified
// };

// export const dummyEncryptedNoPresentationData = encrypt(dummyVerifierDid, rsaPublicKeyPem, dummyNoPresentation, 'pem');
// export const dummyEncryptedNoPresentation: WithVersion<EncryptedPresentation> = {
//   presentationRequestInfo: dummyPresentationRequestInfo,
//   encryptedPresentation: dummyEncryptedNoPresentationData,
//   version: '1.0.0'
// };

export const dummyEncryptedDeclinedPresentationData = encrypt(dummyVerifierDid, rsaPublicKeyPem, dummyDeclinedPresentation, 'pem');
export const dummyEncryptedDeclinedPresentation: WithVersion<EncryptedPresentation> = {
  presentationRequestInfo: dummyPresentationRequestInfo,
  encryptedPresentation: dummyEncryptedDeclinedPresentationData,
  version: '2.0.0'
};

export const dummyVerifierRegistrationResponse = {
  authToken: dummyAuthToken,
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
  authToken: dummyAuthToken,
  body: { isVerified: true }
};

// export const dummyNoPresentationVerificationResponse = {
//   authToken: dummyAuthToken,
//   body: { isVerified: true }
// };

const mockDecryptedPresentation: DecryptedPresentation = {
  type: 'VerifiablePresentation',
  presentation: dummyPresentation,
  isVerified: true
};

const mockDecryptedDeclinedPresentation: DecryptedPresentation = {
  type: 'DeclinedPresentation',
  presentation: dummyDeclinedPresentation,
  isVerified: true
};

// const mockDecryptedNoPresentation: DecryptedPresentation = {
//   type: 'NoPresentation',
//   presentation: dummyNoPresentation,
//   isVerified: true
// };

export const mockVerifiedEncryptedPresentation: UnumDto<DecryptedPresentation> = {
  authToken: dummyAuthToken,
  body: mockDecryptedPresentation
};

// export const mockVerifiedEncryptedNoPresentation: UnumDto<DecryptedPresentation> = {
//   authToken: dummyAuthToken,
//   body: mockDecryptedNoPresentation
// };

export const mockVerifiedEncryptedDeclinedPresentation: UnumDto<DecryptedPresentation> = {
  authToken: dummyAuthToken,
  body: mockDecryptedDeclinedPresentation
};

const mockDecryptedInvalidPresentation: DecryptedPresentation = {
  type: 'VerifiablePresentation',
  presentation: dummyPresentation,
  isVerified: false
};

const mockDecryptedInvalidDeclinedPresentation: DecryptedPresentation = {
  type: 'DeclinedPresentation',
  presentation: dummyDeclinedPresentation,
  isVerified: false
};

export const mockNotVerifiedEncryptedPresentation: UnumDto<DecryptedPresentation> = {
  authToken: dummyAuthToken,
  body: mockDecryptedInvalidPresentation
};

export const mockNotVerifiedEncryptedDeclinedPresentation: UnumDto<DecryptedPresentation> = {
  authToken: dummyAuthToken,
  body: mockDecryptedInvalidDeclinedPresentation
};
