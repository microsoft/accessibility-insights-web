// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { GenericToggle, GenericToggleProps } from 'DetailsView/components/generic-toggle';

describe('GenericToggleTest', () => {
    let onClickMock: IMock<(id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => void>;

    beforeEach(() => {
        onClickMock = Mock.ofInstance((id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => {});
    });

    test.each([true, false])('render with string content - toggleState : %s', (toggleState: boolean) => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: 'test description',
            enabled: toggleState,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };

        const wrapped = shallow(<GenericToggle {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('render with jsx content', () => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: <h1>hello</h1>,
            enabled: true,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };

        const wrapped = shallow(<GenericToggle {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('verify onclick call', () => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: 'test description',
            enabled: true,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };

        const wrapped = shallow(<GenericToggle {...props} />);

        const toggle = wrapped.find(`#${props.id}`);
        const eventStub: any = {};
        toggle.simulate('click', eventStub);

        onClickMock.verify(ocm => ocm(props.id, !props.enabled, eventStub), Times.once());
    });
});
