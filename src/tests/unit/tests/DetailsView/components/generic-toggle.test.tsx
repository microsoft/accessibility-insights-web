// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { fireEvent, render } from '@testing-library/react';
import { GenericToggle, GenericToggleProps } from 'DetailsView/components/generic-toggle';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { Toggle } from '@fluentui/react';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../mock-helpers/mock-module-helpers');
describe('GenericToggleTest', () => {
    mockReactComponents([Toggle]);
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

            const renderResult = render(<GenericToggle {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
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

            const renderResult = render(<GenericToggle {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handles toggle click', async () => {
            const props: GenericToggleProps = {
                name: 'test name',
                description: 'test description',
                enabled: true,
                onClick: onClickMock.object,
                id: 'test-id-1',
            };

            const renderResult = render(<GenericToggle {...props} />);
            renderResult.debug();

            const toggle = renderResult.container.querySelector(`#${props.id}`);
            fireEvent.click(toggle);

            onClickMock.verify(
                handler => handler(props.id, !props.enabled, It.isAny()),
                Times.once(),
            );
        });
    });
});
