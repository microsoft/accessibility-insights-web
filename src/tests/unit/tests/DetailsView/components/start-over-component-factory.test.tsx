// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { NamedFC } from 'common/react/named-fc';
import {
    AssessmentNavState,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    CommandBarProps,
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import {
    getStartOverComponentForAssessment,
    getStartOverComponentForFastPass,
} from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ScanResults } from 'scanner/iruleresults';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('StartOverComponentFactory', () => {
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;

    let assessment: Readonly<Assessment>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let assessmentStoreData: AssessmentStoreData;
    let visualizationScanResultData: VisualizationScanResultData;
    let scanResult: ScanResults;
    let scanning: string;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        featureFlagStoreData = {};
        scanResult = null;
        scanning = null;
    });

    function getProps(isForAssessment: boolean): DetailsViewCommandBarProps {
        const deps = {} as DetailsViewCommandBarDeps;

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
        visualizationScanResultData = {
            issues: {
                scanResult: scanResult,
            },
        } as VisualizationScanResultData;

        assessmentStoreData = {
            assessmentNavState: {
                selectedTestType,
                selectedTestSubview: theTestStep,
            } as AssessmentNavState,
        } as AssessmentStoreData;

        return {
            deps,
            featureFlagStoreData,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            visualizationScanResultData,
            visualizationStoreData,
        } as DetailsViewCommandBarProps;
    }

    function setScanResult(): void {
        scanResult = {} as ScanResults;
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
            test('scanResults is null => component matches snapshot', () => {
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('scanResults is not null, scanning is false => component matches snapshot', () => {
                setScanResult();
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('scanResults is not null, scanning is true => component matches snapshot', () => {
                setScanResult();
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

                const Wrapper = NamedFC<CommandBarProps>(
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
