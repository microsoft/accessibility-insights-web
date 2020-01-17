// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentInstanceSelectedButton,
    AssessmentInstanceSelectedButtonProps,
} from 'DetailsView/components/assessment-instance-selected-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';

describe('AssessmentInstanceSelectedButton', () => {
    describe('render', () => {
        const onSelectedStub = () => {};

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

            const wrapped = shallow(<AssessmentInstanceSelectedButton {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
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

        test('onButtonClicked: true', () => {
            onSelectedMock.setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny())).verifiable(Times.once());

            const props: AssessmentInstanceSelectedButtonProps = {
                ...baseProps,
                isVisualizationEnabled: true,
                isVisible: true,
            } as AssessmentInstanceSelectedButtonProps;
            const testSubject = new AssessmentInstanceSelectedButton(props);

            (testSubject as any).onButtonClicked(eventStub);

            onSelectedMock.verifyAll();
        });

        test('onButtonClicked: false', () => {
            onSelectedMock.setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny())).verifiable(Times.once());

            const props: AssessmentInstanceSelectedButtonProps = {
                ...baseProps,
                isVisualizationEnabled: false,
                isVisible: true,
            } as AssessmentInstanceSelectedButtonProps;
            const testSubject = new AssessmentInstanceSelectedButton(props);

            (testSubject as any).onButtonClicked(eventStub);

            onSelectedMock.verifyAll();
        });

        test('onButtonClicked: invisible', () => {
            onSelectedMock.setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny())).verifiable(Times.never());

            const props: AssessmentInstanceSelectedButtonProps = {
                ...baseProps,
                isVisualizationEnabled: true,
                isVisible: false,
            } as AssessmentInstanceSelectedButtonProps;
            const testSubject = new AssessmentInstanceSelectedButton(props);

            (testSubject as any).onButtonClicked(eventStub);

            onSelectedMock.verifyAll();
        });
    });
});
