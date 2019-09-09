// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState, UpdateStateCallback } from 'electron/device-connect-view/components/device-connect-body';
import { DeviceConnectPortEntry, DeviceConnectPortEntryProps } from 'electron/device-connect-view/components/device-connect-port-entry';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceConnectPortEntryTest', () => {
    const testPortNumber = 111;
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

    let fetchScanResultsMock: IMock<FetchScanResultsType>;
    let updateStateCallbackMock: IMock<UpdateStateCallback>;

    beforeEach(() => {
        fetchScanResultsMock = Mock.ofType<FetchScanResultsType>(undefined, MockBehavior.Strict);
        updateStateCallbackMock = Mock.ofType<UpdateStateCallback>(undefined, MockBehavior.Strict);
    });

    describe('renders', () => {
        const needsValidationCases = [true, false];

        it.each(needsValidationCases)('with needsValidation = %s', needsValidation => {
            const props = {
                needsValidation,
            } as DeviceConnectPortEntryProps;

            const rendered = shallow(<DeviceConnectPortEntry {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        describe('change port number', () => {
            const portNumberCases = [testPortNumber.toString(), '', null];

            it.each(portNumberCases)('handles port text = "%s"', portNumberText => {
                updateStateCallbackMock.setup(callback => callback(DeviceConnectState.Default, undefined));

                const props = {
                    updateStateCallback: updateStateCallbackMock.object,
                } as DeviceConnectPortEntryProps;

                const rendered = shallow(<DeviceConnectPortEntry {...props} />);

                expect(rendered.state()).toMatchSnapshot();

                rendered.find('.port-number-field').simulate('change', null, portNumberText);

                updateStateCallbackMock.verifyAll();

                expect(rendered.state()).toMatchSnapshot();
            });
        });

        describe('validate port number', () => {
            let props: DeviceConnectPortEntryProps;

            type ValidatePortTestCase = {
                fetch: FetchScanResultsType;
                connectState: DeviceConnectState;
                deviceName: string;
                description: string;
            };

            const testCases: ValidatePortTestCase[] = [
                {
                    fetch: () => Promise.resolve({ deviceName: 'dev', appIdentifier: 'app' } as ScanResults),
                    connectState: DeviceConnectState.Connected,
                    deviceName: 'dev - app',
                    description: 'fetch succeed',
                },
                {
                    fetch: () => Promise.reject({} as ScanResults),
                    connectState: DeviceConnectState.Error,
                    deviceName: undefined,
                    description: 'fetch fail',
                },
            ];

            beforeEach(() => {
                updateStateCallbackMock.setup(r => r(DeviceConnectState.Connecting)).verifiable(Times.once());

                props = {
                    fetchScanResults: fetchScanResultsMock.object,
                    updateStateCallback: updateStateCallbackMock.object,
                } as DeviceConnectPortEntryProps;
            });

            test.each(testCases)('%p', async ({ fetch, connectState, deviceName }) => {
                setupFetchScanResultsMock(fetch);
                setupUpdateStateCallbackMock(connectState, deviceName);

                const rendered = shallow(<DeviceConnectPortEntry {...props} />);
                rendered.setState({ isValidateButtonDisabled: false, port: testPortNumber });
                const button = rendered.find('.button-validate-port');

                button.simulate('click', eventStub);

                fetchScanResultsMock.verifyAll();

                await tick();

                expect(rendered.state()).toEqual({ isValidateButtonDisabled: false, port: testPortNumber });
                updateStateCallbackMock.verifyAll();
            });

            const setupFetchScanResultsMock = (fetch: FetchScanResultsType) => {
                fetchScanResultsMock
                    .setup(r => r(testPortNumber))
                    .returns(fetch)
                    .verifiable();
            };

            const setupUpdateStateCallbackMock = (connectState: DeviceConnectState, deviceName: string) => {
                updateStateCallbackMock.setup(callback => callback(connectState, deviceName)).verifiable();
            };

            // Helper function returns a promise that resolves after all other promise mocks,
            // even if they are chained like Promise.resolve().then(...)
            // Technically: this is designed to resolve on the next macro-task
            const tick = (): Promise<void> => {
                return new Promise((resolve: () => void) => {
                    setTimeout(resolve, 0);
                });
            };
        });
    });
});
