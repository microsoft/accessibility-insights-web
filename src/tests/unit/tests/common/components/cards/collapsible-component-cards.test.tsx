// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsCollapsibleControl,
    CollapsibleComponentCardsProps,
} from 'common/components/cards/collapsible-component-cards';
import { HeadingElementForLevel } from 'common/components/heading-element-for-level';
import { shallow } from 'enzyme';
import { forOwn } from 'lodash';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { SetFocusVisibility } from 'types/set-focus-visibility';

describe('CollapsibleComponentCardsTest', () => {
    const eventStubFactory = new EventStubFactory();

    let setFocusVisibilityMock: IMock<SetFocusVisibility>;
    let onExpandToggleMock: IMock<(event: React.MouseEvent<HTMLDivElement>) => void>;
    let clickEventMock: IMock<React.MouseEvent<HTMLDivElement>>;

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
        onExpandToggleMock = Mock.ofType<(event: React.MouseEvent<HTMLDivElement>) => void>();
        clickEventMock = Mock.ofType<React.MouseEvent<HTMLDivElement>>();
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
                const result = shallow(control);
                expect(result.getElement()).toMatchSnapshot();
                onExpandToggleMock.verifyAll();
            });
        });
    });

    test('toggle from expanded to collapsed', () => {
        onExpandToggleMock.setup(mock => mock(clickEventMock.object)).verifiable(Times.once());

        const props: CollapsibleComponentCardsProps = {
            ...partialProps,
            id: 'test-id',
        } as CollapsibleComponentCardsProps;

        const control = CardsCollapsibleControl(props);
        const result = shallow(control);
        expect(result.getElement()).toMatchSnapshot('expanded');

        const button = result.find('CustomizedActionButton');
        button.simulate('click', clickEventMock.object);
        expect(result.getElement()).toMatchSnapshot('collapsed');

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

        it('should set focus visibility to true for keyboard event', () => {
            const eventStub = eventStubFactory.createKeypressEvent();

            const control = CardsCollapsibleControl(props);
            const result = shallow(control);

            const button = result.find('CustomizedActionButton');
            button.simulate('click', eventStub);

            setFocusVisibilityMock.verify(handler => handler(true, undefined), Times.once());
        });

        it('should not even call set focus visibility for mouse event', () => {
            const eventStub = eventStubFactory.createMouseClickEvent();

            const control = CardsCollapsibleControl(props);
            const result = shallow(control);

            const button = result.find('CustomizedActionButton');
            button.simulate('click', eventStub);

            setFocusVisibilityMock.verify(
                handler => handler(It.isAny(), It.isAny()),
                Times.never(),
            );
        });
    });
});
