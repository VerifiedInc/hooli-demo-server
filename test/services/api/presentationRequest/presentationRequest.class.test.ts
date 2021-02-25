import { PresentationRequestService } from '../../../../src/services/api/presentationRequest/presentationRequest.class';
import { Application } from '../../../../src/declarations';
import {
  dummyPresentationRequestEntity,
  dummyPresentationRequestEntityOptions,
  dummyPresentationRequestPostDto,
  dummyPresentationRequestResponseDto
} from '../../../mocks';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;

  const mockPresentationRequestDataService = {
    create: jest.fn(),
    get: jest.fn(),
    remove: jest.fn()
  };

  beforeAll(() => {
    const app = {
      service: () => {
        return mockPresentationRequestDataService;
      }
    } as unknown as Application;
    service = new PresentationRequestService({}, app);
  });

  describe('create', () => {
    it('creates a PresentationRequestEntity with the presentationRequest data service', async () => {
      mockPresentationRequestDataService.create.mockResolvedValueOnce(dummyPresentationRequestEntity);
      const response = await service.create(dummyPresentationRequestPostDto);
      expect(mockPresentationRequestDataService.create).toBeCalledWith(dummyPresentationRequestEntityOptions, undefined);
      expect(response).toEqual(dummyPresentationRequestResponseDto);
    });
  });

  describe('get', () => {
    it('gets a PresentationRequest from the data service by uuid/params', async () => {
      mockPresentationRequestDataService.get.mockResolvedValueOnce(dummyPresentationRequestEntity);
      const response = await service.get(dummyPresentationRequestEntity.uuid);
      expect(mockPresentationRequestDataService.get).toBeCalledWith(dummyPresentationRequestEntity.uuid, undefined);
      expect(response).toEqual(dummyPresentationRequestResponseDto);
    });
  });
});
