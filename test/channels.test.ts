import { HookContext } from '@feathersjs/feathers';

import channels, { presentationPublisher } from '../src/channels';
import { Application } from '../src/declarations';
import { dummyPresentationRequestEntity, dummyPresentationResponseDto } from './mocks';

describe('channels', () => {
  const mockPublish = jest.fn();
  const mockChannel = jest.fn();
  const mockService = jest.fn();

  const dummyPresentationService = {
    publish: mockPublish
  };

  const dummyRequestService = {
    get: jest.fn(() => dummyPresentationRequestEntity)
  };

  const app = {
    on: jest.fn(),
    publish: jest.fn(),
    service: mockService,
    channel: mockChannel
  } as unknown as Application;

  afterEach(() => {
    mockService.mockReset();
  });

  describe('presentationPublisher', () => {
    it('returns a function', () => {
      expect(typeof presentationPublisher(app)).toEqual('function');
    });

    describe('the inner function', () => {
      it('publishes to the correct session channel', async () => {
        mockService.mockReturnValueOnce(dummyRequestService);
        await presentationPublisher(app)(dummyPresentationResponseDto, {} as HookContext);
        expect(app.channel).toBeCalledWith(dummyPresentationRequestEntity.prMetadata.fields.sessionUuid);
      });
    });
  });

  it('publishes presentations with presentationPublisher', async () => {
    mockService.mockReturnValueOnce(dummyPresentationService);
    channels(app);
    expect(mockService.mock.calls[0][0]).toEqual('presentationWebsocket');
    expect(mockPublish).toBeCalled();
  });
});
