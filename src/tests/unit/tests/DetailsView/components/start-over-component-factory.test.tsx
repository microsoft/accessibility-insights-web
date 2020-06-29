// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { NamedFC } from 'common/react/named-fc';
import {
    AssessmentNavState,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    getStartOverComponentForAssessment,
    getStartOverComponentForFastPass,
    StartOverFactoryProps,
} from 'DetailsView/components/start-over-component-factory';
import { StartOverDeps } from 'DetailsView/components/start-over-dropdown';
import { shallow } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('StartOverComponentFactory', () => {
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;
    const dropdownDirection = 'down';

    let assessment: Readonly<Assessment>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let scanning: string;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        scanning = null;
    });

    function getProps(isForAssessment: boolean): StartOverFactoryProps {
        const deps = {} as StartOverDeps;

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
            assessmentsProvider: assessmentsProviderMock.object,
            visualizationStoreData,
            dropdownDirection,
        } as StartOverFactoryProps;
    }

    describe('getStartOverComponentForAssessments', () => {
        it('renders', () => {
            const props = getProps(true);
            const rendered = getStartOverComponentForAssessment(props);

            expect(rendered).toMatchSnapshot();
        });
    });

    describe('getStartOverComponentPropsForFastPass', () => {
        describe('renders', () => {
            test('scanning is false => component matches snapshot', () => {
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('scanning is true => component matches snapshot', () => {
                scanning = 'some string';
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });
        });

        describe('user interaction', () => {
            it('handles action button on click properly', () => {
                const event = new EventStubFactory().createKeypressEvent() as any;

                const actionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();

                const props = getProps(false);
                props.deps.detailsViewActionMessageCreator = actionMessageCreatorMock.object;

                const Wrapper = NamedFC<StartOverFactoryProps>(
                    'WrappedStartOver',
                    getStartOverComponentForFastPass,
                );
                const wrapped = shallow(<Wrapper {...props} />);
                wrapped.simulate('click', event);

                actionMessageCreatorMock.verify(
                    creator => creator.rescanVisualization(theTestType, event),
                    Times.once(),
                );
            });
        });
    });
});
