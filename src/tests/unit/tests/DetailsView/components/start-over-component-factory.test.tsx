// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from '@fluentui/react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
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
import { StartOverDropdown } from 'DetailsView/components/start-over-dropdown';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';

jest.mock('DetailsView/components/start-over-dropdown');

describe('StartOverComponentFactory', () => {
    mockReactComponents([StartOverDropdown]);
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;

    let assessment: Readonly<Assessment>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let scanning: string;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType(undefined);
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
            selectedTestType = theTestType;
            assessmentsProviderMock
                .setup(apm => apm.forType(theTestType))
                .returns(() => assessment);
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
            hasSubMenu: true,
        } as StartOverFactoryProps;
    }

    describe('AssessmentStartOverFactory', () => {
        it('getStartOverComponent', () => {
            const props = getProps(true);
            const rendered = AssessmentStartOverFactory.getStartOverComponent(props);
            console.log('rendered-->', rendered);
            expect(rendered.props).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
        });

        it('getStartOverMenuItem', () => {
            const props = getProps(true);
            const menuItem = AssessmentStartOverFactory.getStartOverMenuItem(props);
            const renderResult = render(menuItem.children);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
        });
    });

    describe('QuickAssessStartOverFactory', () => {
        it('getStartOverComponent', () => {
            const props = getProps(true);
            const rendered = QuickAssessStartOverFactory.getStartOverComponent(props);
            expect(rendered).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
        });

        it('getStartOverMenuItem', () => {
            const props = getProps(true);
            const menuItem = QuickAssessStartOverFactory.getStartOverMenuItem(props);
            const renderResult = render(menuItem.children);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
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
                getComponentOrMenuItem: (props: StartOverFactoryProps) => any | StartOverMenuItem,
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
                        expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
                    });

                    test('scanning is true => component matches snapshot', () => {
                        scanning = 'some string';
                        const props = getProps(false);
                        const item = getComponentOrMenuItem(props);

                        expect(item).toMatchSnapshot();
                        expectMockedComponentPropsToMatchSnapshots([StartOverDropdown]);
                    });
                });

                it('handles action button on click properly', () => {
                    useOriginalReactElements('DetailsView/components/start-over-dropdown', [
                        'StartOverDropdown',
                    ]);
                    const event = new EventStubFactory().createKeypressEvent() as any;

                    const actionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();

                    const props = getProps(false);
                    props.deps.detailsViewActionMessageCreator = actionMessageCreatorMock.object;

                    const item = getComponentOrMenuItem(props);
                    console.log(item);
                    //clickComponentOrMenuItem(item?.children?.props?.children?.props ? item?.children?.props?.children?.props : item, event);

                    clickComponentOrMenuItem(item, event);
                    // getMockComponentClassPropsForCall(item).props.onClick(event);

                    actionMessageCreatorMock.verify(
                        creator => creator.rescanVisualization(It.isAny(), It.isAny()),
                        Times.once(),
                    );
                });
            },
        );

        function clickStartOverButton(startOverButton: JSX.Element, event: any): void {
            const renderResult = render(startOverButton);
            const onClick = renderResult.getByRole('button');
            fireEvent.click(onClick);
        }

        function clickStartOverMenuItem(startOverMenuItem: IContextualMenuItem, event: any): void {
            console.log('startOverMenuItem', startOverMenuItem);
            startOverMenuItem.children.props.children?.props.onClick(event);
            //userEvent.click(startOverMenuItem.getByRole('menuitem'), event);
        }
    });
});
