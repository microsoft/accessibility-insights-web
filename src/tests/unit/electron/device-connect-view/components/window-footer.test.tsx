// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { WindowFooter, WindowFooterProps } from '../../../../../electron/device-connect-view/components/window-footer';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('WindowTitleTest', () => {
    test('render', () => {
        const props: WindowFooterProps = {
            cancelClick: () => {
                return;
            },
        };
        const rendered = shallow(<WindowFooter {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('cancel click', () => {
        const onClickMock = Mock.ofInstance(() => {});

        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

        const props: WindowFooterProps = {
            cancelClick: onClickMock.object,
        };

        const rendered = shallow(<WindowFooter {...props} />);
        const button = rendered.find('.window-footer-button-cancel');
        button.simulate('click', eventStub);

        onClickMock.verify(onClick => onClick(), Times.once());
    });
});
