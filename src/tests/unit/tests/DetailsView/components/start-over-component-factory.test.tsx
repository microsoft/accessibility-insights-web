// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import {
    AssessmentNavState,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentStartOverFactory,
    FastpassStartOverFactory,
    QuickAssessStartOverFactory,
    StartOverFactoryDeps,
    StartOverFactoryProps,
    StartOverMenuItem,
} from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('StartOverComponentFactory', () => {
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;

    let assessment: Readonly<Assessment>;
    let requirement: Readonly<Requirement>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let scanning: string;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        scanning = null;
    });

    function getProps(isForAssessment: boolean): StartOverFactoryProps {
        const deps = {
            getProvider: () => assessmentsProviderMock.object,
        } as StartOverFactoryDeps;

        let visualizationStoreData: VisualizationStoreData = null;
        let selectedTestType: VisualizationType = null;

        if (isForAssessment) {
            assessment = {
                title: theTitle,
            } as Readonly<Assessment>;
            requirement = {
                name: 'requirement name stub',
            } as Readonly<Requirement>;
            selectedTestType = theTestType;
            assessmentsProviderMock
                .setup(apm => apm.forType(theTestType))
                .returns(() => assessment);
            assessmentsProviderMock
                .setup(apm => apm.getStep(theTestType, theTestStep))
                .returns(() => requirement);
        } else {
            visualizationStoreData = {
                selectedFastPassDetailsView: theTestType,
                scanning,
            } as VisualizationStoreData;
        }

        assessmentStoreData = {
            assessmentNavState: {
                selectedTestType,
                selectedTestSubview: theTestStep,
            } as AssessmentNavState,
        } as AssessmentStoreData;

        return {
            deps,
            assessmentStoreData,
            visualizationStoreData,
            rightPanelConfiguration: {
                startOverContextMenuKeyOptions: {
                    showTest: true,
                },
            },
        } as StartOverFactoryProps;
    }

    describe('AssessmentStartOverFactory', () => {
        it('getStartOverComponent', () => {
            const props = getProps(true);
            const rendered = AssessmentStartOverFactory.getStartOverComponent(props);
            expect(rendered).toMatchSnapshot();
        });

        it('getStartOverMenuItem', () => {
            const props = getProps(true);
            const menuItem = AssessmentStartOverFactory.getStartOverMenuItem(props);
            const rendered = shallow(menuItem.onRender());

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('QuickAssessStartOverFactory', () => {
        it('getStartOverComponent', () => {
            const props = getProps(true);
            const rendered = QuickAssessStartOverFactory.getStartOverComponent(props);
            expect(rendered).toMatchSnapshot();
        });

        it('getStartOverMenuItem', () => {
            const props = getProps(true);
            const menuItem = QuickAssessStartOverFactory.getStartOverMenuItem(props);
            const rendered = shallow(menuItem.onRender());

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('FastpassStartOverFactory', () => {
        describe.each([
            [
                'getStartOverComponent',
                FastpassStartOverFactory.getStartOverComponent,
                clickStartOverButton,
            ],
            [
                'getStartOverMenuItem',
                FastpassStartOverFactory.getStartOverMenuItem,
                clickStartOverMenuItem,
            ],
        ])(
            '%s',
            (
                testName: string,
                getComponentOrMenuItem: (
                    props: StartOverFactoryProps,
                ) => JSX.Element | StartOverMenuItem,
                clickComponentOrMenuItem: (
                    item: JSX.Element | StartOverMenuItem,
                    event: any,
                ) => void,
            ) => {
                describe('renders', () => {
                    test('scanning is false => component matches snapshot', () => {
                        const props = getProps(false);
                        const item = getComponentOrMenuItem(props);

                        expect(item).toMatchSnapshot();
                    });

                    test('scanning is true => component matches snapshot', () => {
                        scanning = 'some string';
                        const props = getProps(false);
                        const item = getComponentOrMenuItem(props);

                        expect(item).toMatchSnapshot();
                    });
                });

                it('handles action button on click properly', () => {
                    const event = new EventStubFactory().createKeypressEvent() as any;

                    const actionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();

                    const props = getProps(false);
                    props.deps.detailsViewActionMessageCreator = actionMessageCreatorMock.object;

                    const item = getComponentOrMenuItem(props);
                    clickComponentOrMenuItem(item, event);

                    actionMessageCreatorMock.verify(
                        creator => creator.rescanVisualization(theTestType, event),
                        Times.once(),
                    );
                });
            },
        );

        function clickStartOverButton(startOverButton: JSX.Element, event: any): void {
            const wrapped = shallow(startOverButton);
            wrapped.simulate('click', event);
        }

        function clickStartOverMenuItem(startOverMenuItem: IContextualMenuItem, event: any): void {
            startOverMenuItem.onClick(event);
        }
    });
});
