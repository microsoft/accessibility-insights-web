// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GenericToggle, GenericToggleProps } from 'DetailsView/components/generic-toggle';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('GenericToggleTest', () => {
    type OnClick = GenericToggleProps['onClick'];
    let onClickMock: IMock<OnClick>;

    beforeEach(() => {
        onClickMock = Mock.ofType<OnClick>();
    });

    describe('renders', () => {
        it.each([true, false])('toggle enable = %s', enabled => {
            const props: GenericToggleProps = {
                name: 'test name',
                description: 'test description',
                enabled,
                onClick: onClickMock.object,
                id: 'test-id-1',
            };

            const wrapped = shallow(<GenericToggle {...props} />);
            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it.each`
            testDescription     | descriptionContent
            ${'is string'}      | ${'test string description'}
            ${'is JSX.Element'} | ${(<h1>hello</h1>)}
        `('description content $testDescription', ({ descriptionContent }) => {
            const props: GenericToggleProps = {
                name: 'test name',
                description: descriptionContent,
                enabled: true,
                onClick: onClickMock.object,
                id: 'test-id-1',
            };

            const wrapped = shallow(<GenericToggle {...props} />);
            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handles toggle click', () => {
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

            onClickMock.verify(
                handler => handler(props.id, !props.enabled, eventStub),
                Times.once(),
            );
        });
    });
});
