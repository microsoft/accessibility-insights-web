// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceConnectFooter, DeviceConnectFooterProps } from 'electron/views/device-connect-view/components/device-connect-footer';
import { footerButtonCancel } from 'electron/views/device-connect-view/components/device-connect-footer.scss';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { Mock, Times } from 'typemoq';

describe('DeviceConnectFooterTest', () => {
    test('render', () => {
        const props: DeviceConnectFooterProps = {
            cancelClick: () => {
                return;
            },
            canStartTesting: false,
        };
        const rendered = shallow(<DeviceConnectFooter {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('cancel click', () => {
        const onClickMock = Mock.ofInstance(() => {});

        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

        const props: DeviceConnectFooterProps = {
            cancelClick: onClickMock.object,
            canStartTesting: false,
        };

        const rendered = shallow(<DeviceConnectFooter {...props} />);
        const button = rendered.find(`.${footerButtonCancel}`);
        button.simulate('click', eventStub);

        onClickMock.verify(onClick => onClick(), Times.once());
    });
});
