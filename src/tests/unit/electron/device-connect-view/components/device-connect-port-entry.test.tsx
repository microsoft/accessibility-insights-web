// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { OnConnectedCallback, OnConnectingCallback } from '../../../../../electron/device-connect-view/components/device-connect-body';
import {
    DeviceConnectPortEntry,
    DeviceConnectPortEntryProps,
} from '../../../../../electron/device-connect-view/components/device-connect-port-entry';
import { FetchScanResultsType } from '../../../../../electron/platform/android/fetch-scan-results';
import { ScanResults } from '../../../../../electron/platform/android/scan-results';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DeviceConnectPortEntryTest', () => {
    let testPortNumber: number;
    let eventStub: React.MouseEvent<Button>;
    let fetchScanResultsMock: IMock<FetchScanResultsType>;
    let onConnected: OnConnectedCallback;
    let onConnectingMock: IMock<OnConnectingCallback>;
    let onConnectedMock: IMock<OnConnectedCallback>;

    beforeAll(() => {
        testPortNumber = 111;
        eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
        onConnected = (isConnected, deviceName) => {};
        onConnectingMock = Mock.ofInstance(() => {});
        onConnectedMock = Mock.ofInstance(onConnected);
    });

    test('render', () => {
        const props = {} as DeviceConnectPortEntryProps;
        const rendered = shallow(<DeviceConnectPortEntry {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('onChange updates state', () => {
        const fetch: FetchScanResultsType = _ => Promise.reject({} as ScanResults);
        const props = SetupPropsMocks(fetch, false, false, undefined);
        const rendered = shallow(<DeviceConnectPortEntry {...props} />);

        expect(rendered.state()).toMatchSnapshot();

        const onChangeHandler = rendered.find('.port-number-field').prop('onChange') as (
            event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            newValue?: string,
        ) => void;

        onChangeHandler(null, testPortNumber.toString());

        onConnectedMock.verifyAll();
        expect(rendered.state()).toMatchSnapshot();
    });

    test('validate click fetch succeeds', () => {
        const fetch: FetchScanResultsType = _ => Promise.resolve({ deviceName: 'dev', appIdentifier: 'app' } as ScanResults);
        const props = SetupPropsMocks(fetch, true, false, 'dev - app');
        ValidatePortValidateClick(props);
    });

    test('validate click fetch fails', () => {
        const fetch: FetchScanResultsType = _ => Promise.reject({} as ScanResults);
        const props = SetupPropsMocks(fetch, false, true, undefined);
        ValidatePortValidateClick(props);
    });

    const SetupPropsMocks = (
        fetch: FetchScanResultsType,
        expectedSuccess: boolean,
        expectedFailed: boolean,
        expectedDevice: string,
    ): DeviceConnectPortEntryProps => {
        onConnectingMock.reset();
        onConnectingMock.setup(r => r()).verifiable();

        fetchScanResultsMock = Mock.ofInstance(fetch);
        fetchScanResultsMock
            .setup(r => r(testPortNumber))
            .returns(fetch)
            .verifiable();

        onConnectedMock.reset();
        onConnectedMock.setup(r => r(expectedSuccess, expectedFailed, expectedDevice)).verifiable();

        return {
            fetchScanResults: fetchScanResultsMock.object,
            onConnectingCallback: onConnectingMock.object,
            onConnectedCallback: onConnectedMock.object,
        } as DeviceConnectPortEntryProps;
    };

    const ValidatePortValidateClick = (props: DeviceConnectPortEntryProps) => {
        const rendered = shallow(<DeviceConnectPortEntry {...props} />);
        rendered.setState({ isValidateButtonDisabled: false, port: testPortNumber });
        const button = rendered.find('.button-validate-port');
        button.simulate('click', eventStub);

        fetchScanResultsMock.verifyAll();
        onConnectingMock.verifyAll();

        const validateAfterPromise = (): void => {
            expect(rendered.state()).toEqual({ isValidateButtonDisabled: false, port: testPortNumber });
            onConnectedMock.verifyAll();
        };

        setImmediate(validateAfterPromise);
    };
});
