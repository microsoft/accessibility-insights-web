// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { KeyCodeConstants } from 'common/constants/keycode-constants';
import { EnumHelper } from 'common/enum-helper';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { DeviceConnectState } from 'electron/flux/types/device-connect-state';
import {
    DeviceConnectPortEntry,
    DeviceConnectPortEntryProps,
    deviceConnectValidatePortButtonAutomationId,
} from 'electron/views/device-connect-view/components/device-connect-port-entry';
import { portNumberField } from 'electron/views/device-connect-view/components/device-connect-port-entry.scss';
import { shallow } from 'enzyme';
import { Button, MaskedTextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceConnectPortEntryTest', () => {
    const testPortNumber = 111;
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

    let deviceConnectActionCreatorMock: IMock<DeviceConnectActionCreator>;

    beforeEach(() => {
        deviceConnectActionCreatorMock = Mock.ofType<DeviceConnectActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
    });

    describe('renders', () => {
        const deviceConnectStates = EnumHelper.getNumericValues<DeviceConnectState>(
            DeviceConnectState,
        ).map(state => DeviceConnectState[state]);

        it.each(deviceConnectStates)('with %p', deviceConnectStateName => {
            const props: DeviceConnectPortEntryProps = {
                viewState: {
                    deviceConnectState: DeviceConnectState[deviceConnectStateName],
                },
            } as DeviceConnectPortEntryProps;

            const rendered = shallow(<DeviceConnectPortEntry {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        it.each(deviceConnectStates)(
            'with %p and some text in the port text field',
            deviceConnectStateName => {
                const props: DeviceConnectPortEntryProps = {
                    viewState: {
                        deviceConnectState: DeviceConnectState[deviceConnectStateName],
                    },
                } as DeviceConnectPortEntryProps;

                const rendered = shallow(<DeviceConnectPortEntry {...props} />);
                rendered.setState({ port: '1234' });

                expect(rendered.getElement()).toMatchSnapshot();
            },
        );

        it('renderedDescription', () => {
            const props: DeviceConnectPortEntryProps = {
                viewState: {},
            } as DeviceConnectPortEntryProps;

            const rendered = shallow(<DeviceConnectPortEntry {...props} />);
            const renderedDescription = shallow(
                rendered.find(MaskedTextField).prop('onRenderDescription')(),
            );

            expect(renderedDescription.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        describe('change port number', () => {
            const portNumberCases = [testPortNumber.toString(), '', null];

            it.each(portNumberCases)('handles port text = "%s"', portNumberText => {
                deviceConnectActionCreatorMock
                    .setup(creator => creator.resetConnection())
                    .verifiable(Times.once());

                const props = {
                    viewState: {
                        deviceConnectState: DeviceConnectState.Default,
                    },
                    deps: {
                        deviceConnectActionCreator: deviceConnectActionCreatorMock.object,
                    },
                } as DeviceConnectPortEntryProps;

                const rendered = shallow(<DeviceConnectPortEntry {...props} />);

                expect(rendered.state()).toMatchSnapshot('before');

                rendered.find(`.${portNumberField}`).simulate('change', null, portNumberText);

                expect(rendered.state()).toMatchSnapshot('after');
                deviceConnectActionCreatorMock.verifyAll();
            });
        });

        it('validates port', () => {
            deviceConnectActionCreatorMock
                .setup(creator => creator.validatePort(testPortNumber))
                .verifiable(Times.once());

            const props = {
                deps: {
                    deviceConnectActionCreator: deviceConnectActionCreatorMock.object,
                },
                viewState: {
                    deviceConnectState: DeviceConnectState.Default,
                },
            } as DeviceConnectPortEntryProps;
            const rendered = shallow(<DeviceConnectPortEntry {...props} />);
            rendered.setState({ port: testPortNumber });

            const buttonSelector = getAutomationIdSelector(
                deviceConnectValidatePortButtonAutomationId,
            );
            const button = rendered.find(buttonSelector);

            button.simulate('click', eventStub);

            deviceConnectActionCreatorMock.verifyAll();
        });

        it('validates port through enter key', () => {
            deviceConnectActionCreatorMock
                .setup(creator => creator.validatePort(testPortNumber))
                .verifiable(Times.once());

            const props = {
                deps: {
                    deviceConnectActionCreator: deviceConnectActionCreatorMock.object,
                },
                viewState: {
                    deviceConnectState: DeviceConnectState.Default,
                },
            } as DeviceConnectPortEntryProps;
            const rendered = shallow(<DeviceConnectPortEntry {...props} />);
            rendered.setState({ port: testPortNumber });
            const textField = rendered.find(MaskedTextField);

            textField.simulate('keydown', { keyCode: KeyCodeConstants.ENTER });

            deviceConnectActionCreatorMock.verifyAll();
        });
    });
});
