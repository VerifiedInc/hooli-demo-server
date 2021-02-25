import { PresentationService } from '../../../../src/services/api/presentation/presentation.class';
import { Application } from '../../../../src/declarations';
import {
  dummyPresentationEntity,
  dummyPresentationEntityOptions,
  dummyPresentationResponseDto,
  dummyNoPresentationEntity,
  dummyPresentationWithVerification,
  dummyNoPresentationResponseDto,
  dummyNoPresentationEntityOptions,
  dummyNoPresentationWithVerification
} from '../../../mocks';

describe('PresentationService', () => {
  let service: PresentationService;

  const mockDataService = {
    create: jest.fn()
  };

  beforeAll(() => {
    const app = {
      service: () => {
        return mockDataService;
      }
    } as unknown as Application;
    service = new PresentationService({}, app);
  });

  describe('create', () => {
    it('creates a PresentationEntity with the presentation data service', async () => {
      mockDataService.create.mockResolvedValueOnce(dummyPresentationEntity);
      const response = await service.create(dummyPresentationWithVerification);
      expect(mockDataService.create).toBeCalledWith(dummyPresentationEntityOptions, undefined);
      expect(response).toEqual(dummyPresentationResponseDto);
    });

    it('handles a NoPresentation', async () => {
      mockDataService.create.mockResolvedValueOnce(dummyNoPresentationEntity);
      const response = await service.create(dummyNoPresentationWithVerification);
      expect(mockDataService.create).toBeCalledWith(dummyNoPresentationEntityOptions, undefined);
      expect(response).toEqual(dummyNoPresentationResponseDto);
    });
  });
});
