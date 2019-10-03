// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { Mock, MockBehavior, Times } from 'typemoq';

import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import {
    AutomatedChecksCommandBar,
    AutomatedChecksCommandBarProps,
} from 'electron/views/automated-checks/components/automated-checks-command-bar';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';

describe('AutomatedChecksCommandBar', () => {
    test('render', () => {
        const props: AutomatedChecksCommandBarProps = { deps: { deviceConnectActionCreator: null } };
        const rendered = shallow(<AutomatedChecksCommandBar {...props} />);

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
        } as AutomatedChecksCommandBarProps;

        const rendered = shallow(<AutomatedChecksCommandBar {...props} />);
        const button = rendered.find('[text="Rescan"]');

        button.simulate('click', eventStub);

        deviceConnectActionCreatorMock.verifyAll();
    });
});
