// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { makeRawBrowserMessageHandler } from 'common/browser-adapters/browser-message-handler';
import type { Runtime } from 'webextension-polyfill';

describe(makeRawBrowserMessageHandler, () => {
    const stubMessage = { messageContent: 'stub' };
    const stubSender: Runtime.MessageSender = {};

    it('propagates unhandled responses as void', () => {
        const underlyingHandler = jest.fn((_message, _sender) => ({
            messageHandled: false as const,
        }));
        const testSubject = makeRawBrowserMessageHandler(underlyingHandler);

        const response = testSubject(stubMessage, stubSender);

        expect(underlyingHandler).toHaveBeenCalledTimes(1);
        expect(underlyingHandler).toHaveBeenCalledWith(stubMessage, stubSender);
        expect(response).toBeUndefined();
    });

    it('propagates handled responses as their response value', () => {
        const originalResponsePromise = Promise.resolve();
        const underlyingHandler = jest.fn((_message, _sender) => ({
            messageHandled: true as const,
            result: originalResponsePromise,
        }));
        const testSubject = makeRawBrowserMessageHandler(underlyingHandler);

        const response = testSubject(stubMessage, stubSender);

        expect(underlyingHandler).toHaveBeenCalledTimes(1);
        expect(underlyingHandler).toHaveBeenCalledWith(stubMessage, stubSender);
        expect(response).toBe(originalResponsePromise);
    });
});
