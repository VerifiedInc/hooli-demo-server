import { SessionService } from '../../../../src/services/api/session/session.class';
import { Application } from '../../../../src/declarations';
import { dummySession } from '../../../mocks';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionDataService = {
    create: jest.fn(),
    get: jest.fn(),
    remove: jest.fn()
  };

  beforeAll(() => {
    const app = {
      service: () => {
        return mockSessionDataService;
      }
    } as unknown as Application;
    service = new SessionService({}, app);
  });

  describe('create', () => {
    it('creates a session with the session data service', async () => {
      mockSessionDataService.create.mockResolvedValueOnce(dummySession);
      const createdSession = await service.create({});
      expect(mockSessionDataService.create).toBeCalledWith({}, undefined);
      expect(createdSession).toEqual(dummySession);
    });
  });

  describe('get', () => {
    it('gets a session with the session data service', async () => {
      mockSessionDataService.get.mockResolvedValueOnce(dummySession);
      const session = await service.get(dummySession.uuid);
      expect(mockSessionDataService.get).toBeCalledWith(dummySession.uuid, undefined);
      expect(session).toEqual(dummySession);
    });
  });

  describe('remove', () => {
    it('removes a session with the session data service', async () => {
      mockSessionDataService.remove.mockResolvedValueOnce(dummySession);
      const removedSession = await service.remove(dummySession.uuid);
      expect(mockSessionDataService.remove).toBeCalledWith(dummySession.uuid, undefined);
      expect(removedSession).toEqual(dummySession);
    });
  });
});
