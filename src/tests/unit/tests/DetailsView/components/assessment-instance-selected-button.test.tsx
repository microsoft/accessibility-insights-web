// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon, IconButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentInstanceSelectedButton,
    AssessmentInstanceSelectedButtonProps,
} from 'DetailsView/components/assessment-instance-selected-button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { mockReactComponents, useOriginalReactElements } from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react');

describe('AssessmentInstanceSelectedButton', () => {
    mockReactComponents([IconButton])
    describe('render', () => {
        const onSelectedStub = () => { };

        const baseProps: Partial<AssessmentInstanceSelectedButtonProps> = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            onSelected: onSelectedStub,
        };

        it.each`
            description                                          | isVisualizationEnabled | isVisible
            ${'when element is selected and visible'}            | ${true}                | ${true}
            ${'when element is selected but hidden'}             | ${true}                | ${false}
            ${'when element is not selected and is visible'}     | ${false}               | ${true}
            ${'when element is not selected and is not visible'} | ${false}               | ${false}
        `('$description', ({ isVisualizationEnabled, isVisible }) => {
            const props: AssessmentInstanceSelectedButtonProps = {
                ...baseProps,
                isVisualizationEnabled,
                isVisible,
            } as AssessmentInstanceSelectedButtonProps;

            const wrapped = render(<AssessmentInstanceSelectedButton {...props} />);

            expect(wrapped.asFragment()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        useOriginalReactElements('@fluentui/react', ['IconButton'])
        const eventStub = new EventStubFactory().createMouseClickEvent();
        let baseProps: Partial<AssessmentInstanceSelectedButtonProps>;

        type OnSelected = AssessmentInstanceSelectedButtonProps['onSelected'];

        let onSelectedMock: IMock<OnSelected>;

        beforeEach(() => {
            onSelectedMock = Mock.ofType<OnSelected>();

            baseProps = {
                test: VisualizationType.HeadingsAssessment,
                step: 'headingLevel',
                selector: 'selector',
                onSelected: onSelectedMock.object,
            };
        });

        it.each([true, false])(
            'onButtonClicked: with visualization enabled = %s',
            isVisualizationEnabled => {
                const props: AssessmentInstanceSelectedButtonProps = {
                    ...baseProps,
                    isVisualizationEnabled,
                    isVisible: true,
                } as AssessmentInstanceSelectedButtonProps;

                onSelectedMock
                    .setup(handler =>
                        handler(
                            !isVisualizationEnabled,
                            baseProps.test,
                            baseProps.step,
                            baseProps.selector,
                        ),
                    )
                    .verifiable(Times.once());

                const wrapped = render(<AssessmentInstanceSelectedButton {...props} />);

                const iconButton = wrapped.getByRole('checkbox');
                fireEvent.click(iconButton, eventStub);

                onSelectedMock.verifyAll();
            },
        );

        test('onButtonClicked: isVisible = false', () => {
            const props: AssessmentInstanceSelectedButtonProps = {
                ...baseProps,
                isVisualizationEnabled: true,
                isVisible: false,
            } as AssessmentInstanceSelectedButtonProps;

            onSelectedMock
                .setup(handler => handler(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());

            const wrapped = render(<AssessmentInstanceSelectedButton {...props} />);

            const iconButton = wrapped.getByRole('checkbox');

            fireEvent.click(iconButton, eventStub);
            onSelectedMock.verifyAll();
        });
    });
});
