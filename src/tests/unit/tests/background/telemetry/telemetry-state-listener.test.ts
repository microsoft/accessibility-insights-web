// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryStateListener } from 'background/telemetry/telemetry-state-listener';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';

type TestCase = {
    userConfigState: UserConfigurationStoreData;
};

describe('TelemetryStateListenerTest', () => {
    let userConfigStoreMock: IMock<UserConfigurationStore>;
    let telemetryEventHandlerStrictMock: IMock<TelemetryEventHandler>;
    let testSubject: TelemetryStateListener;
    let changeListeners: Array<Function>;
    let userConfigState: UserConfigurationStoreData;

    beforeEach(() => {
        userConfigStoreMock = Mock.ofType(UserConfigurationStore);
        telemetryEventHandlerStrictMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        changeListeners = [];
        userConfigState = {} as any;
        setupChangeListener(userConfigStoreMock);

        userConfigStoreMock.setup(f => f.getState()).returns(() => userConfigState);

        testSubject = new TelemetryStateListener(
            userConfigStoreMock.object,
            telemetryEventHandlerStrictMock.object,
        );
    });

    it('do nothing if not initialized', () => {
        expect(changeListeners.length).toBe(0);
    });

    it('addChangedListener & update telemetry state on initialize', () => {
        userConfigState = {} as any;

        setupDisableTelemetry();

        testSubject.initialize();

        expect(changeListeners.length).toBe(1);
        telemetryEventHandlerStrictMock.verifyAll();
    });

    describe('verify state change listener', () => {
        beforeEach(() => {
            setupDisableTelemetry();
            testSubject.initialize();
            telemetryEventHandlerStrictMock.reset();
        });

        const disableCases: Array<TestCase> = [
            {
                userConfigState: {} as UserConfigurationStoreData,
            },
            {
                userConfigState: {
                    enableTelemetry: false,
                } as UserConfigurationStoreData,
            },
        ];

        test.each(disableCases)('disable telemetry: %p', (testCase: TestCase) => {
            userConfigState = testCase.userConfigState;

            setupDisableTelemetry();

            changeListeners[0]();

            telemetryEventHandlerStrictMock.verifyAll();
        });

        it('enable telemetry only when enableTelemetry is true', () => {
            userConfigState = {
                enableTelemetry: true,
            } as UserConfigurationStoreData;

            setupEnableTelemetry();
            changeListeners[0]();

            telemetryEventHandlerStrictMock.verifyAll();
        });
    });

    function setupChangeListener(store: IMock<BaseStoreImpl<any>>): void {
        store
            .setup(f => f.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListeners.push(cb);
            });
    }

    function setupEnableTelemetry(): void {
        telemetryEventHandlerStrictMock.setup(t => t.enableTelemetry()).verifiable();
    }

    function setupDisableTelemetry(): void {
        telemetryEventHandlerStrictMock.setup(t => t.disableTelemetry()).verifiable();
    }
});
