// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    MaximizeRestoreButton,
    MaximizeRestoreButtonProps,
} from 'electron/views/results/components/maximize-restore-button';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { Mock, Times } from 'typemoq';

describe('MaximizeRestoreButton', () => {
    it('renders with restore', () => {
        const props: MaximizeRestoreButtonProps = { isMaximized: true, onClick: null };

        const rendered = shallow(<MaximizeRestoreButton {...props} />);
        const icon = rendered.getElement().props.onRenderIcon();

        expect(rendered.getElement()).toMatchSnapshot();
        expect(icon).toMatchSnapshot();
    });

    it('renders with maximize', () => {
        const props: MaximizeRestoreButtonProps = { isMaximized: false, onClick: null };
        const rendered = shallow(<MaximizeRestoreButton {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click', () => {
        const eventStub =
            new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
        const onClickMock = Mock.ofInstance(() => {});
        const props: MaximizeRestoreButtonProps = {
            isMaximized: false,
            onClick: onClickMock.object,
        };

        const rendered = shallow(<MaximizeRestoreButton {...props} />);
        rendered.simulate('click', eventStub);

        onClickMock.verify(onClick => onClick(), Times.once());
    });
});
