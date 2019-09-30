// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectPortEntry, DeviceConnectPortEntryProps } from 'electron/device-connect-view/components/device-connect-port-entry';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { EnumHelper } from '../../../../../../common/enum-helper';
import { DeviceConnectState } from '../../../../../../electron/device-connect-view/components/device-connect-state';

describe('DeviceConnectPortEntryTest', () => {
    const testPortNumber = 111;
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

    let deviceConnectActionCreatorMock: IMock<DeviceConnectActionCreator>;

    beforeEach(() => {
        deviceConnectActionCreatorMock = Mock.ofType<DeviceConnectActionCreator>(undefined, MockBehavior.Strict);
    });

    describe('renders', () => {
        type TestCase = {
            needsValidation: boolean;
            deviceConnectState: DeviceConnectState;
        };

        const testScenarios: TestCase[] = EnumHelper.getNumericValues<DeviceConnectState>(DeviceConnectState)
            .map(state => {
                return { needsValidation: true, deviceConnectState: state };
            })
            .concat(
                EnumHelper.getNumericValues<DeviceConnectState>(DeviceConnectState).map(state => {
                    return { needsValidation: false, deviceConnectState: state };
                }),
            );

        it.each(testScenarios)('with %p', testScenario => {
            const props: DeviceConnectPortEntryProps = {
                needsValidation: testScenario.needsValidation,
                viewState: {
                    deviceConnectState: testScenario.deviceConnectState,
                },
            } as DeviceConnectPortEntryProps;

            const rendered = shallow(<DeviceConnectPortEntry {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        describe('change port number', () => {
            const portNumberCases = [testPortNumber.toString(), '', null];

            it.each(portNumberCases)('handles port text = "%s"', portNumberText => {
                const props = {
                    viewState: {
                        deviceConnectState: DeviceConnectState.Default,
                    },
                } as DeviceConnectPortEntryProps;

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
                viewState: {
                    deviceConnectState: DeviceConnectState.Default,
                },
            } as DeviceConnectPortEntryProps;
            const rendered = shallow(<DeviceConnectPortEntry {...props} />);
            rendered.setState({ port: testPortNumber });
            const button = rendered.find('.button-validate-port');

            button.simulate('click', eventStub);

            deviceConnectActionCreatorMock.verifyAll();
        });
    });
});
