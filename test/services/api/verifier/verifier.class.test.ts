import { VerifierService } from '../../../../src/services/api/verifier/verifier.class';
import { Application } from '../../../../src/declarations';
import { dummyVerifierEntity, dummyVerifierEntityOptions, dummyVerifierRequestDto, dummyVerifierResponseDto } from '../../../mocks';

describe('VerifierService', () => {
  let service: VerifierService;

  const mockVerifierDataService = {
    create: jest.fn(),
    get: jest.fn(),
    find: jest.fn(),
    patch: jest.fn(),
    remove: jest.fn()
  };

  beforeAll(() => {
    const app = {
      service: () => {
        return mockVerifierDataService;
      }
    } as unknown as Application;
    service = new VerifierService({}, app);
  });

  describe('create', () => {
    it('creates a VerifierEntity with the verifier data service', async () => {
      mockVerifierDataService.create.mockResolvedValueOnce(dummyVerifierEntity);
      const response = await service.create(dummyVerifierRequestDto);
      expect(mockVerifierDataService.create).toBeCalledWith(dummyVerifierEntityOptions, undefined);
      expect(response).toEqual(dummyVerifierResponseDto);
    });
  });

  describe('get', () => {
    it('gets a verifier from the data service by uuid/params', async () => {
      mockVerifierDataService.get.mockResolvedValueOnce(dummyVerifierEntity);
      const response = await service.get(dummyVerifierEntity.uuid);
      expect(mockVerifierDataService.get).toBeCalledWith(dummyVerifierEntity.uuid, undefined);
      expect(response).toEqual(dummyVerifierResponseDto);
    });
  });
});
