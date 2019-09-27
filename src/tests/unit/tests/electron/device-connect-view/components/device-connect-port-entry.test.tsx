// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectPortEntry, DeviceConnectPortEntryProps } from 'electron/device-connect-view/components/device-connect-port-entry';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceConnectPortEntryTest', () => {
    const testPortNumber = 111;
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

    let deviceConnectActionCreatorMock: IMock<DeviceConnectActionCreator>;

    beforeEach(() => {
        deviceConnectActionCreatorMock = Mock.ofType<DeviceConnectActionCreator>(undefined, MockBehavior.Strict);
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
                const props = {} as DeviceConnectPortEntryProps;

                const rendered = shallow(<DeviceConnectPortEntry {...props} />);

                expect(rendered.state()).toMatchSnapshot();

                rendered.find('.port-number-field').simulate('change', null, portNumberText);

                expect(rendered.state()).toMatchSnapshot();
            });
        });

        it('validates port', () => {
            deviceConnectActionCreatorMock.setup(creator => creator.validatePort(testPortNumber)).verifiable(Times.once());

            const props = {
                deps: {
                    deviceConnectActionCreator: deviceConnectActionCreatorMock.object,
                },
            } as DeviceConnectPortEntryProps;
            const rendered = shallow(<DeviceConnectPortEntry {...props} />);
            rendered.setState({ isValidateButtonDisabled: false, port: testPortNumber });
            const button = rendered.find('.button-validate-port');

            button.simulate('click', eventStub);

            deviceConnectActionCreatorMock.verifyAll();
        });
    });
});
