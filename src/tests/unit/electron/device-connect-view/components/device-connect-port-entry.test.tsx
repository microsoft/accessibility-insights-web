// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { OnConnectedCallback } from '../../../../../electron/device-connect-view/components/device-connect-body';
import {
    DeviceConnectPortEntry,
    DeviceConnectPortEntryProps,
} from '../../../../../electron/device-connect-view/components/device-connect-port-entry';
import { FetchScanResults } from '../../../../../electron/platform/android/fetch-scan-results';
import { ScanResults } from '../../../../../electron/platform/android/scan-results';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DeviceConnectPortEntryTest', () => {
    test('render', () => {
        const props = {} as DeviceConnectPortEntryProps;
        const rendered = shallow(<DeviceConnectPortEntry {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('validate click fetch succeeds', () => {
        const fetch: FetchScanResults = _ => Promise.resolve({ deviceName: 'dev', appIdentifier: 'app' } as ScanResults);
        ValidatePortValidateClick(fetch, true, 'dev - app');
    });

    test('validate click fetch fails', () => {
        const fetch: FetchScanResults = _ => Promise.reject({} as ScanResults);
        ValidatePortValidateClick(fetch, false, undefined);
    });

    const ValidatePortValidateClick = (fetch: FetchScanResults, expectedSuccess: boolean, expectedDevice: string) => {
        const testPortNumber = 111;
        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
        const fetchScanResultsMock = Mock.ofInstance(fetch);
        const onConnected: OnConnectedCallback = (isConnected, deviceName) => {};
        const onConnectingMock = Mock.ofInstance(() => {});
        const onConnectedMock = Mock.ofInstance(onConnected);

        fetchScanResultsMock
            .setup(r => r(testPortNumber))
            .returns(fetch)
            .verifiable();

        onConnectedMock.setup(r => r(expectedSuccess, expectedDevice)).verifiable();

        const props = {
            fetchScanResults: fetchScanResultsMock.object,
            onConnectingCallback: onConnectingMock.object,
            onConnectedCallback: onConnectedMock.object,
        } as DeviceConnectPortEntryProps;

        const rendered = shallow(<DeviceConnectPortEntry {...props} />);
        rendered.setState({ isValidateButtonDisabled: false, port: testPortNumber });
        const button = rendered.find('.button-validate-port');
        button.simulate('click', eventStub);

        fetchScanResultsMock.verifyAll();
        onConnectingMock.verify(onClick => onClick(), Times.once());

        const validateAfterPromise = (): void => {
            expect(rendered.state()).toEqual({ isValidateButtonDisabled: false, port: testPortNumber });
            onConnectedMock.verifyAll();
        };

        setImmediate(validateAfterPromise);
    };
});
