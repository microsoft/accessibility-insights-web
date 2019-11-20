// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlags } from 'common/feature-flags';
import { AssessmentNavState, AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewCommandBarDeps, DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { getStartOverComponentForAssessment, getStartOverComponentForFastPass } from 'DetailsView/components/start-over-component-factory';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, MockBehavior } from 'typemoq';

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
            assessmentsProviderMock.setup(apm => apm.forType(theTestType)).returns(() => assessment);
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
                selectedTestStep: theTestStep,
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

    function setCardsUiFlag(flagValue: boolean): void {
        featureFlagStoreData[FeatureFlags.universalCardsUI] = flagValue;
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
            test('CardsUI is undefined => component is null', () => {
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('CardsUI is false => component is null', () => {
                setCardsUiFlag(false);
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('CardsUI is true, scanResults is null => component is null', () => {
                setCardsUiFlag(true);
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('CardsUI is true, scanResults is not null, scanning is false => component matches snapshot', () => {
                setScanResult();
                setCardsUiFlag(true);
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });

            test('CardsUI is true, scanResults is not null, scanning is true => component matches snapshot', () => {
                setScanResult();
                setCardsUiFlag(true);
                scanning = 'some string';
                const props = getProps(false);
                const rendered = getStartOverComponentForFastPass(props);

                expect(rendered).toMatchSnapshot();
            });
        });
    });
});
