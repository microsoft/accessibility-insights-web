// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { AutomatedChecksView, AutomatedChecksViewProps } from 'electron/views/automated-checks/automated-checks-view';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

describe('AutomatedChecksView', () => {
    describe('renders', () => {
        it('renders the automated checks view', () => {
            const props: AutomatedChecksViewProps = {
                deps: {
                    deviceConnectActionCreator: null,
                    windowStateActionCreator: Mock.ofType(WindowStateActionCreator).object,
                    scanActionCreator: Mock.ofType(ScanActionCreator).object,
                    windowFrameActionCreator: Mock.ofType(WindowFrameActionCreator).object,
                },
                scanStoreData: {},
                deviceStoreData: {},
                windowStateStoreData: 'window state store data' as any,
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('scanning spinner', () => {
            const props: AutomatedChecksViewProps = {
                deps: {
                    deviceConnectActionCreator: null,
                    windowStateActionCreator: Mock.ofType(WindowStateActionCreator).object,
                    scanActionCreator: Mock.ofType(ScanActionCreator).object,
                    windowFrameActionCreator: Mock.ofType(WindowFrameActionCreator).object,
                },
                scanStoreData: {
                    status: ScanStatus.Scanning,
                },
                deviceStoreData: {} as any,
                windowStateStoreData: 'window state store data' as any,
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('device disconnected', () => {
            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: Mock.ofType(ScanActionCreator).object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                deviceStoreData: {
                    connectedDevice: 'TEST DEVICE',
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
