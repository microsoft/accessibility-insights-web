// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PostMessageContentRepository } from 'background/post-message-content-repository';
import { DateProvider } from 'common/date-provider';
import { RespondableCommandMessageCommunicator } from 'injected/frameCommunicators/respondable-command-message-communicator';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('PostMessageContentRepositoryTest', () => {
    const messageTokenStub: string = 'test-token-1';
    const contentStub = 'test-content-1';
    const contentTimestamp = DateProvider.getDateFromTimestamp('2021-02-06T00:31:51.965Z');
    const onTimeRetrieveTimestamp = DateProvider.getDateFromTimestamp('2021-02-06T00:32:00.000Z');
    const couldNotFindContentErrorMessage = 'Could not find content for specified token';
    const staleContentErrorMessage = 'Content for specified token was stale';
    let getCurrentDateMock: IMock<() => Date>;
    let testSubject: PostMessageContentRepository;

    beforeEach(() => {
        getCurrentDateMock = Mock.ofType<() => Date>(undefined, MockBehavior.Strict);
        testSubject = new PostMessageContentRepository(getCurrentDateMock.object);
    });

    it('should not age-out messages faster than the message communicator times out', () => {
        expect(PostMessageContentRepository.maxAgeOfContentRecordInMilliseconds).toBeGreaterThan(
            RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds,
        );
    });

    it('throws error if storeContent was never called prior to calling popContent', () => {
        expect(() => testSubject.popContent(messageTokenStub)).toThrowError(
            couldNotFindContentErrorMessage,
        );
    });

    it('returns content based on message token stored from a storeContent call', () => {
        getCurrentDateMock.setup(getter => getter()).returns(() => contentTimestamp);
        testSubject.storeContent(messageTokenStub, contentStub);

        getCurrentDateMock.setup(getter => getter()).returns(() => onTimeRetrieveTimestamp);
        const expectedContent = contentStub;

        const actualContent = testSubject.popContent(messageTokenStub);

        expect(actualContent).toEqual(expectedContent);
    });

    it('throws error when trying to pop the same content more than once', () => {
        getCurrentDateMock.setup(getter => getter()).returns(() => contentTimestamp);
        testSubject.storeContent(messageTokenStub, contentStub);
        getCurrentDateMock.setup(getter => getter()).returns(() => onTimeRetrieveTimestamp);

        testSubject.popContent(messageTokenStub);

        expect(() => testSubject.popContent(messageTokenStub)).toThrowError(
            couldNotFindContentErrorMessage,
        );
    });

    it('deletes content and throws error if content is too old', () => {
        getCurrentDateMock.setup(getter => getter()).returns(() => contentTimestamp);
        testSubject.storeContent(messageTokenStub, contentStub);

        const lateRetrieveTimestamp = DateProvider.getDateFromTimestamp('2021-02-06T00:35:00.000Z');
        getCurrentDateMock.setup(getter => getter()).returns(() => lateRetrieveTimestamp);

        expect(() => testSubject.popContent(messageTokenStub)).toThrowError(
            staleContentErrorMessage,
        );
        expect(() => testSubject.popContent(messageTokenStub)).toThrowError(
            couldNotFindContentErrorMessage,
        );
    });
});
