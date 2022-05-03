// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { StoreUpdateMessage } from 'common/types/store-update-message';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { DebugToolsMessageDistributor } from 'debug-tools/debug-tools-message-distributor';
import { IMock, It, Mock } from 'typemoq';

describe(DebugToolsMessageDistributor, () => {
    let registeredListener: (message: any) => void;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryListenerMock: IMock<TelemetryListener>;
    let storeUpdateHubMock: IMock<StoreUpdateMessageHub>;

    let testSubject: DebugToolsMessageDistributor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryListenerMock = Mock.ofType<TelemetryListener>();
        storeUpdateHubMock = Mock.ofType<StoreUpdateMessageHub>();

        browserAdapterMock
            .setup(b => b.addListenerOnMessage(It.isAny()))
            .returns(listener => (registeredListener = listener));

        testSubject = new DebugToolsMessageDistributor(
            browserAdapterMock.object,
            storeUpdateHubMock.object,
            telemetryListenerMock.object,
        );
    });

    it('registers listener that calls both message handlers', () => {
        const message = { messageType: 'message type' };

        telemetryListenerMock.setup(t => t.onTelemetryMessage(message)).verifiable();
        storeUpdateHubMock
            .setup(s => s.handleMessage(message as StoreUpdateMessage<unknown>))
            .verifiable();

        testSubject.initialize();

        expect(registeredListener).toBeDefined();
        registeredListener(message);

        telemetryListenerMock.verifyAll();
        storeUpdateHubMock.verifyAll();
    });
});
