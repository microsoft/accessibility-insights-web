// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AssessmentInstanceSelectedButton,
    AssessmentInstanceSelectedButtonProps,
} from '../../../../../DetailsView/components/assessment-instance-selected-button';

describe('AssessmentInstanceSelectedButton', () => {
    test('constructor', () => {
        const testObject = new AssessmentInstanceSelectedButton(
            {} as AssessmentInstanceSelectedButtonProps,
        );
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render when element is selected and visible', () => {
        const onSelectedStub = (selected, test, step, selector) => {};
        const onButtonClickedStub = ev => {};

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: true,
            isVisible: true,
            onSelected: onSelectedStub,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);
        (testSubject as any).onButtonClicked = onButtonClickedStub;

        const expected = (
            <IconButton
                className={'instance-visibility-button'}
                iconProps={{
                    className:
                        'test-instance-selected test-instance-selected-visible',
                    iconName: 'view',
                }}
                onClick={onButtonClickedStub}
                disabled={false}
                role="checkbox"
                aria-checked={props.isVisualizationEnabled}
                aria-label="Visualization"
            />
        );

        expect(testSubject.render()).toEqual(expected);
    });

    test('render when element is selected but hidden', () => {
        const onSelectedStub = (selected, test, step, selector) => {};
        const onButtonClickedStub = ev => {};

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: true,
            isVisible: false,
            onSelected: onSelectedStub,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);
        (testSubject as any).onButtonClicked = onButtonClickedStub;

        const expected = (
            <IconButton
                className={
                    'instance-visibility-button test-instance-selected-hidden-button'
                }
                iconProps={{
                    className:
                        'test-instance-selected test-instance-selected-hidden',
                    iconName: 'hide2',
                }}
                onClick={onButtonClickedStub}
                disabled={true}
                role="checkbox"
                aria-checked={props.isVisualizationEnabled}
                aria-label="Visualization"
            />
        );

        expect(testSubject.render()).toEqual(expected);
    });

    test('render when element is not selected and is visible', () => {
        const onSelectedStub = (selected, test, step, selector) => {};
        const onButtonClickedStub = ev => {};

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: false,
            isVisible: true,
            onSelected: onSelectedStub,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);
        (testSubject as any).onButtonClicked = onButtonClickedStub;

        const expected = (
            <IconButton
                className={'instance-visibility-button'}
                iconProps={{ className: '', iconName: 'checkBox' }}
                onClick={onButtonClickedStub}
                disabled={false}
                role="checkbox"
                aria-checked={props.isVisualizationEnabled}
                aria-label="Visualization"
            />
        );

        expect(testSubject.render()).toEqual(expected);
    });

    test('render when element is not selected and is not visible', () => {
        const onSelectedStub = (selected, test, step, selector) => {};
        const onButtonClickedStub = ev => {};

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: false,
            isVisible: false,
            onSelected: onSelectedStub,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);
        (testSubject as any).onButtonClicked = onButtonClickedStub;

        const expected = (
            <IconButton
                className={
                    'instance-visibility-button test-instance-selected-hidden-button'
                }
                iconProps={{ className: '', iconName: 'hide2' }}
                onClick={onButtonClickedStub}
                disabled={true}
                role="checkbox"
                aria-checked={props.isVisualizationEnabled}
                aria-label="Visualization"
            />
        );

        expect(testSubject.render()).toEqual(expected);
    });

    test('onButtonClicked: true', () => {
        const eventStub = {} as any;
        const onSelectedMock = Mock.ofInstance(
            (selected, test, step, selector) => {},
        );

        onSelectedMock
            .setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.once());

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: true,
            isVisible: true,
            onSelected: onSelectedMock.object,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);

        (testSubject as any).onButtonClicked(eventStub);

        onSelectedMock.verifyAll();
    });

    test('onButtonClicked: false', () => {
        const eventStub = {} as any;
        const onSelectedMock = Mock.ofInstance(
            (selected, test, step, selector) => {},
        );

        onSelectedMock
            .setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.once());

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: false,
            isVisible: true,
            onSelected: onSelectedMock.object,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);

        (testSubject as any).onButtonClicked(eventStub);

        onSelectedMock.verifyAll();
    });

    test('onButtonClicked: invisible', () => {
        const eventStub = {} as any;
        const onSelectedMock = Mock.ofInstance(
            (selected, test, step, selector) => {},
        );

        onSelectedMock
            .setup(s => s(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());

        const props: AssessmentInstanceSelectedButtonProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            selector: 'selector',
            isVisualizationEnabled: true,
            isVisible: false,
            onSelected: onSelectedMock.object,
        };
        const testSubject = new AssessmentInstanceSelectedButton(props);

        (testSubject as any).onButtonClicked(eventStub);

        onSelectedMock.verifyAll();
    });
});
