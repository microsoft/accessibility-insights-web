// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { Mock, MockBehavior, Times } from 'typemoq';

import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { CommandBar, CommandBarProps } from 'electron/views/automated-checks/components/command-bar';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';

describe('CommandBar', () => {
    test('render', () => {
        const props: CommandBarProps = { deps: { deviceConnectActionCreator: null } };
        const rendered = shallow(<CommandBar {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('rescan click', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

        const deviceConnectActionCreatorMock = Mock.ofType<DeviceConnectActionCreator>(undefined, MockBehavior.Strict);
        deviceConnectActionCreatorMock.setup(creator => creator.resetConnection()).verifiable(Times.once());

        const props = {
            deps: {
                deviceConnectActionCreator: deviceConnectActionCreatorMock.object,
            },
        };

        const rendered = shallow(<CommandBar {...props} />);
        const button = rendered.find('[text="Rescan"]');

        button.simulate('click', eventStub);

        deviceConnectActionCreatorMock.verifyAll();
    });
});
