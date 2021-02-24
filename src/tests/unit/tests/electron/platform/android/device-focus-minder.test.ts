// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavStore } from 'electron/flux/store/left-nav-store';
import { TabStopsStore } from 'electron/flux/store/tab-stops-store';
import { LeftNavStoreData } from 'electron/flux/types/left-nav-store-data';
import { TabStopsStoreData } from 'electron/flux/types/tab-stops-store-data';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusMinder } from 'electron/platform/android/device-focus-minder';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusMinder', () => {
    let deviceFocusControllerMock: IMock<DeviceFocusController>;
    let tabStopsStoreMock: IMock<TabStopsStore>;
    let leftNavStoreMock: IMock<LeftNavStore>;
    let testSubject: DeviceFocusMinder;

    beforeEach(() => {
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>(
            undefined,
            MockBehavior.Strict,
        );
        tabStopsStoreMock = Mock.ofType<TabStopsStore>(undefined, MockBehavior.Strict);
        leftNavStoreMock = Mock.ofType<LeftNavStore>(undefined, MockBehavior.Strict);

        testSubject = new DeviceFocusMinder(
            deviceFocusControllerMock.object,
            tabStopsStoreMock.object,
            leftNavStoreMock.object,
        );
    });

    function verifyAllMocks() {
        deviceFocusControllerMock.verifyAll();
        tabStopsStoreMock.verifyAll();
        leftNavStoreMock.verifyAll();
    }

    it('constructor changes nothing', () => {});

    it('initialize registers listener', () => {
        leftNavStoreMock.setup(m => m.addChangedListener(It.isAny())).verifiable(Times.once());

        testSubject.initialize();

        verifyAllMocks();
    });

    describe('Subject is initialized', () => {
        let changeListener;

        beforeEach(() => {
            leftNavStoreMock
                .setup(m => m.addChangedListener(It.is(p => p instanceof Function)))
                .callback(cb => (changeListener = cb))
                .verifiable(Times.once());

            testSubject.initialize();
        });

        const leftNavItemKeys: LeftNavItemKey[] = [
            'automated-checks',
            'tab-stops',
            'needs-review',
            'overview',
        ];

        it.each(leftNavItemKeys)(
            'Starting not in tab-stops, transitioning to <%s>',
            newSelectedItemKey => {
                const data: LeftNavStoreData = {
                    selectedKey: newSelectedItemKey,
                } as LeftNavStoreData;

                leftNavStoreMock
                    .setup(m => m.getState())
                    .returns(() => data)
                    .verifiable(Times.once());

                changeListener();

                verifyAllMocks();
            },
        );

        describe('Starting in tab-stops', () => {
            let leftNavStoreData: LeftNavStoreData;

            beforeEach(() => {
                leftNavStoreData = {
                    selectedKey: 'tab-stops',
                } as LeftNavStoreData;

                leftNavStoreMock
                    .setup(m => m.getState())
                    .returns(() => leftNavStoreData)
                    .verifiable(Times.exactly(2));

                changeListener();
            });

            function setupTabStopsMock(focusTracking: boolean): void {
                const tabStopsStoreData = {
                    focusTracking,
                } as TabStopsStoreData;

                tabStopsStoreMock
                    .setup(m => m.getState())
                    .returns(() => tabStopsStoreData)
                    .verifiable(Times.once());
            }

            function simulateLeftNavStateChange(newSelectedItemKey: LeftNavItemKey): void {
                leftNavStoreData.selectedKey = newSelectedItemKey;
                changeListener();
            }

            it.each(leftNavItemKeys)(
                'transitioning to <%s>, focus tracking is disabled',
                newSelectedItemKey => {
                    if (newSelectedItemKey !== 'tab-stops') {
                        setupTabStopsMock(false);
                    }

                    simulateLeftNavStateChange(newSelectedItemKey);

                    verifyAllMocks();
                },
            );

            it.each(leftNavItemKeys)(
                'transitioning to <%s>, focus tracking is enabled',
                newSelectedItemKey => {
                    if (newSelectedItemKey !== 'tab-stops') {
                        setupTabStopsMock(true);
                        deviceFocusControllerMock
                            .setup(m => m.resetFocusTracking())
                            .returns(() => Promise.resolve())
                            .verifiable(Times.once());
                    }

                    simulateLeftNavStateChange(newSelectedItemKey);

                    verifyAllMocks();
                },
            );

            it('DeviceController errors when transitioning are silently handled', () => {
                setupTabStopsMock(true);

                deviceFocusControllerMock
                    .setup(m => m.resetFocusTracking())
                    .returns(() => Promise.reject())
                    .verifiable(Times.once());

                simulateLeftNavStateChange('automated-checks');

                verifyAllMocks();
            });
        });
    });
});
