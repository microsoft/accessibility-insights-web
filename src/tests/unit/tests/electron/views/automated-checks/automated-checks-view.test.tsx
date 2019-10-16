// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getUnifiedRuleResults } from 'common/rule-based-view-model-provider';
import { CardRuleResult, CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { AutomatedChecksView, AutomatedChecksViewProps } from 'electron/views/automated-checks/automated-checks-view';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

describe('AutomatedChecksView', () => {
    describe('renders', () => {
        let bareMinimumProps: AutomatedChecksViewProps;

        beforeEach(() => {
            bareMinimumProps = {
                deps: {
                    deviceConnectActionCreator: Mock.ofType(DeviceConnectActionCreator).object,
                    windowStateActionCreator: Mock.ofType(WindowStateActionCreator).object,
                    scanActionCreator: Mock.ofType(ScanActionCreator).object,
                },
                scanStoreData: {},
                deviceStoreData: {
                    connectedDevice: 'TEST DEVICE',
                },
                windowStateStoreData: 'window state store data' as any,
            } as AutomatedChecksViewProps;
        });

        const scanStatues = [undefined, ScanStatus[ScanStatus.Scanning], ScanStatus[ScanStatus.Failed]];

        it.each(scanStatues)('status scan <%s>', scanStatusName => {
            bareMinimumProps.scanStoreData.status = ScanStatus[scanStatusName];

            const wrapped = shallow(<AutomatedChecksView {...bareMinimumProps} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('results', () => {
            const rulesStub = [{ description: 'test-rule-description' } as UnifiedRule];
            const resultsStub = [{ uid: 'test-uid' } as UnifiedResult];

            const getUnifiedRuleResultsMock = Mock.ofInstance(getUnifiedRuleResults);

            const ruleResultsByStatusStub = {
                fail: [{ id: 'test-fail-id' } as CardRuleResult],
            } as CardRuleResultsByStatus;

            getUnifiedRuleResultsMock.setup(getter => getter(rulesStub, resultsStub)).returns(() => ruleResultsByStatusStub);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: Mock.ofType(ScanActionCreator).object,
                    getUnifiedRuleResultsDelegate: getUnifiedRuleResultsMock.object,
                },
                deviceStoreData: {},
                scanStoreData: {
                    status: ScanStatus.Completed,
                },
                userConfigurationStoreData: {
                    isFirstTime: false,
                },
                unifiedScanResultStoreData: {
                    targetAppInfo: {
                        name: 'test-target-app-name',
                    },
                    rules: rulesStub,
                    results: resultsStub,
                },
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    it('triggers scan when first mounted', () => {
        const port = 11111;

        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(port)).verifiable(Times.once());

        const props: AutomatedChecksViewProps = {
            deps: {
                scanActionCreator: scanActionCreatorMock.object,
            },
            scanStoreData: {},
            deviceStoreData: {
                port,
            },
        } as AutomatedChecksViewProps;

        shallow(<AutomatedChecksView {...props} />);

        scanActionCreatorMock.verifyAll();
    });

    describe('DeviceDisconnectedPopup event handlers', () => {
        it('onRescanDevice', () => {
            const port = 11111;

            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                deviceStoreData: {
                    port,
                },
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            scanActionCreatorMock.reset(); // this mock is used on componentDidMount, which is not in the scope of this unit test

            wrapped.find(DeviceDisconnectedPopup).prop('onRescanDevice')();

            scanActionCreatorMock.verify(creator => creator.scan(port), Times.once());
        });

        it('onConnectNewDevice', () => {
            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
            const windowStateActionCreatorMock = Mock.ofType(WindowStateActionCreator);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                    windowStateActionCreator: windowStateActionCreatorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                deviceStoreData: {},
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            wrapped.find(DeviceDisconnectedPopup).prop('onConnectNewDevice')();

            windowStateActionCreatorMock.verify(creator => creator.setRoute(It.isValue({ routeId: 'deviceConnectView' })), Times.once());
        });
    });
});
