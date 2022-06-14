// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserMessageDistributor } from 'common/browser-adapters/browser-message-distributor';
import { BrowserMessageHandler } from 'common/browser-adapters/browser-message-handler';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';

describe(BrowserMessageDistributor, () => {
    let mockBrowserAdapter: SimulatedBrowserAdapter;

    function makeIgnoringHandler(): BrowserMessageHandler {
        return () => ({ messageHandled: false });
    }

    function makeRespondingHandler(response: any): BrowserMessageHandler {
        return () => ({ messageHandled: true, result: response });
    }

    beforeEach(() => {
        mockBrowserAdapter = createSimulatedBrowserAdapter();
    });

    afterEach(() => {
        mockBrowserAdapter.verifyAll();
    });

    it('propogates the return value of the first listener to handle the message', async () => {
        const testSubject = new BrowserMessageDistributor(mockBrowserAdapter.object, [
            makeIgnoringHandler(),
            makeRespondingHandler(Promise.resolve('second handler response')),
        ]);
        testSubject.initialize();

        const response = mockBrowserAdapter.notifyOnMessage('message');

        expect(response.messageHandled).toBe(true);
        await expect(response.result).resolves.toBe('second handler response');
    });

    it("stops invoking further listeners once one indicates that it's handled the message", () => {
        const secondHandler = jest.fn();
        const testSubject = new BrowserMessageDistributor(mockBrowserAdapter.object, [
            makeRespondingHandler(Promise.resolve('first handler response')),
            secondHandler,
        ]);
        testSubject.initialize();

        void mockBrowserAdapter.notifyOnMessage('message');

        expect(secondHandler).not.toHaveBeenCalled();
    });

    it('returns void if no listener handles the message', () => {
        const testSubject = new BrowserMessageDistributor(mockBrowserAdapter.object, [
            makeIgnoringHandler(),
            makeIgnoringHandler(),
            makeIgnoringHandler(),
        ]);
        testSubject.initialize();

        const response = mockBrowserAdapter.notifyOnMessage('message');
        expect(response.messageHandled).toBe(false);
    });
});
