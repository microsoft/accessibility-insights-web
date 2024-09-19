// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
    CardsCollapsibleControl,
    CollapsibleComponentCardsProps,
} from 'common/components/cards/collapsible-component-cards';
import { HeadingElementForLevel } from 'common/components/heading-element-for-level';
import { forOwn } from 'lodash';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { SetFocusVisibility } from 'types/set-focus-visibility';
import {
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react-components');
jest.mock('common/components/heading-element-for-level');

describe('CollapsibleComponentCardsTest', () => {
    mockReactComponents([HeadingElementForLevel, Button]);
    const eventStubFactory = new EventStubFactory();

    let setFocusVisibilityMock: IMock<SetFocusVisibility>;
    let onExpandToggleMock: IMock<(event: React.MouseEvent<HTMLButtonElement>) => void>;
    let clickEventMock: IMock<React.MouseEvent<HTMLButtonElement>>;

    const partialProps: Partial<CollapsibleComponentCardsProps> = {
        header: <HeadingElementForLevel headingLevel={5}>Some header</HeadingElementForLevel>,
        content: <div>Some content</div>,
        isExpanded: true,
    };

    const optionalPropertiesObject = {
        contentClassName: [undefined, 'content-class-name-a'],
        containerClassName: [undefined, 'a-container'],
        buttonAriaLabel: [undefined, 'some button label'],
    };

    beforeEach(() => {
        onExpandToggleMock = Mock.ofType<(event: React.MouseEvent<HTMLButtonElement>) => void>();
        clickEventMock = Mock.ofType<React.MouseEvent<HTMLButtonElement>>();
        setFocusVisibilityMock = Mock.ofType<SetFocusVisibility>();
        partialProps.deps = {
            setFocusVisibility: setFocusVisibilityMock.object,
        };
        partialProps.onExpandToggle = onExpandToggleMock.object;
    });

    forOwn(optionalPropertiesObject, (propertyValues, propertyName) => {
        propertyValues.forEach(value => {
            test(`render with ${propertyName} set to: ${value}`, () => {
                onExpandToggleMock
                    .setup(mock => mock(clickEventMock.object))
                    .verifiable(Times.never());

                const props: CollapsibleComponentCardsProps = {
                    ...partialProps,
                    [propertyName]: value,
                } as CollapsibleComponentCardsProps;

                const control = CardsCollapsibleControl(props);
                const renderResult = render(control);
                expect(renderResult.asFragment()).toMatchSnapshot();
                onExpandToggleMock.verifyAll();
            });
        });
    });

    test('toggle from expanded to collapsed', async () => {
        onExpandToggleMock.setup(mock => mock(It.isAny())).verifiable(Times.once());

        const props: CollapsibleComponentCardsProps = {
            ...partialProps,
            id: 'test-id',
        } as CollapsibleComponentCardsProps;

        const control = CardsCollapsibleControl(props);
        useOriginalReactElements('@fluentui/react-components', ['Button']);
        const renderResult = render(control);

        expect(renderResult.asFragment()).toMatchSnapshot('expanded');

        await userEvent.click(renderResult.getByRole('button'));
        expect(renderResult.asFragment()).toMatchSnapshot('collapsed');

        onExpandToggleMock.verifyAll();
    });

    describe('set focus visibility when expanding/collapsing', () => {
        let props: CollapsibleComponentCardsProps;

        beforeEach(() => {
            props = {
                ...partialProps,
                id: 'test-id',
            } as CollapsibleComponentCardsProps;
        });

        it('should set focus visibility to true for keyboard event', async () => {
            eventStubFactory.createKeypressEvent();

            const control = CardsCollapsibleControl(props);
            useOriginalReactElements('@fluentui/react-components', ['Button']);
            const renderResult = render(control);

            const button = renderResult.getByRole('button');
            await userEvent.type(button, '{enter}');

            setFocusVisibilityMock.verify(handler => handler(true, undefined), Times.once());
        });

        it('should not even call set focus visibility for mouse event', async () => {
            eventStubFactory.createMouseClickEvent();

            const control = CardsCollapsibleControl(props);
            useOriginalReactElements('@fluentui/react-components', ['Button']);
            const renderResult = render(control);

            await userEvent.click(renderResult.getByRole('button'));

            setFocusVisibilityMock.verify(
                handler => handler(It.isAny(), It.isAny()),
                Times.never(),
            );
        });
    });
});
