// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter, OptionalMessageResponse } from 'common/browser-adapters/browser-adapter';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { DebugToolsMessageDistributor } from 'debug-tools/debug-tools-message-distributor';
import { IMock, It, Mock, Times } from 'typemoq';

describe(DebugToolsMessageDistributor, () => {
    let registeredListener: (message: any) => OptionalMessageResponse;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryListenerMock: IMock<TelemetryListener>;
    let storeUpdateHubMock: IMock<StoreUpdateMessageHub>;

    let testSubject: DebugToolsMessageDistributor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryListenerMock = Mock.ofType<TelemetryListener>();
        storeUpdateHubMock = Mock.ofType<StoreUpdateMessageHub>();

        testSubject = new DebugToolsMessageDistributor(
            browserAdapterMock.object,
            storeUpdateHubMock.object,
            telemetryListenerMock.object,
        );
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
    });

    it('initialize registers message listener', () => {
        browserAdapterMock
            .setup(b => b.addListenerOnMessage(It.isAny()))
            .returns(listener => (registeredListener = listener))
            .verifiable(Times.once());

        testSubject.initialize();
    });

    describe('listener', () => {
        let message: any;
        beforeEach(() => {
            message = { messageType: 'message type' };

            browserAdapterMock
                .setup(b => b.addListenerOnMessage(It.isAny()))
                .returns(listener => (registeredListener = listener));

            testSubject.initialize();
            expect(registeredListener).toBeDefined();
        });

        it('calls onTelemetryMessage', () => {
            telemetryListenerMock
                .setup(t => t.onTelemetryMessage(message))
                .verifiable(Times.once());

            registeredListener(message);

            telemetryListenerMock.verifyAll();
        });

        it('calls and propagates a promise rejection from storeUpdateHub', async () => {
            const errorFromStoreUpdateHub = new Error('from storeUpdateHub');

            const recjectingOptionalMessageResponse = {
                messageResponse: Promise.reject(errorFromStoreUpdateHub),
            };
            storeUpdateHubMock
                .setup(m => m.handleMessage(message))
                .returns(() => recjectingOptionalMessageResponse)
                .verifiable(Times.once());

            await expect(registeredListener(message).messageResponse).rejects.toThrowError(
                errorFromStoreUpdateHub,
            );

            storeUpdateHubMock.verifyAll();
        });

        it('calls and propagates a promise fulfillment from storeUpdateHub', async () => {
            const resolvingOptionalMessageResponse = {
                messageResponse: Promise.resolve(),
            };
            storeUpdateHubMock
                .setup(m => m.handleMessage(message))
                .returns(() => resolvingOptionalMessageResponse)
                .verifiable(Times.once());

            await expect(registeredListener(message).messageResponse).resolves.toBeUndefined();

            storeUpdateHubMock.verifyAll();
        });

        it('calls and propagates a void response from storeUpdateHub', () => {
            const undefinedOptionalMessageResponse = {
                messageResponse: undefined,
            };
            storeUpdateHubMock
                .setup(m => m.handleMessage(message))
                .returns(() => undefinedOptionalMessageResponse)
                .verifiable(Times.once());

            expect(registeredListener(message).messageResponse).toBeUndefined;

            storeUpdateHubMock.verifyAll();
        });
    });
});
