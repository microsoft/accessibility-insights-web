// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentNavState, AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewCommandBarDeps, DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { StartOverComponentProps } from 'DetailsView/components/start-over-component';
import {
    getStartOverComponentPropsForAssessment,
    getStartOverComponentPropsForFastPass,
} from 'DetailsView/components/start-over-component-props-factory';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('StartOverComponentPropsFactory', () => {
    const theButtonCaption = 'Start over';
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;

    let assessment: Readonly<Assessment>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let assessmentStoreData: AssessmentStoreData;
    let visualizationScanResultData: VisualizationScanResultData;
    let scanResult: ScanResults;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        featureFlagStoreData = {};
        scanResult = null;
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

    function setCardsUiFlag(flag: boolean): void {
        featureFlagStoreData['universalCardsUI'] = true;
    }

    test('getStartOverComponentPropsForAssessment expected properties are set', () => {
        const props = getProps(true);
        const rendered: StartOverComponentProps = getStartOverComponentPropsForAssessment(props);

        expect(rendered.render).toBe(true);
        expect(rendered.startOverProps.buttonCaption).toBe(theButtonCaption);
        expect(rendered.startOverProps.hasDropdown).toBe(true);
        expect(rendered.startOverProps.test).toBe(theTestType);
    });

    test('getStartOverComponentPropsForFastPass, CardsUI is false, props is null', () => {
        const props = getProps(false);
        const rendered: StartOverComponentProps = getStartOverComponentPropsForFastPass(props);

        expect(rendered).toBeNull();
    });

    test('getStartOverComponentPropsForFastPass, CardsUI is true, scanResults is null, props is null', () => {
        setCardsUiFlag(true);
        const props = getProps(false);
        const rendered: StartOverComponentProps = getStartOverComponentPropsForFastPass(props);

        expect(rendered).toBeNull();
    });

    test('getStartOverComponentPropsForFastPass, CardsUI is true, scanResults is not null, expected properties are set', () => {
        setScanResult();
        setCardsUiFlag(true);
        const props = getProps(false);
        const rendered: StartOverComponentProps = getStartOverComponentPropsForFastPass(props);

        expect(rendered.startOverProps.buttonCaption).toBe(theButtonCaption);
        expect(rendered.startOverProps.hasDropdown).toBe(false);
        expect(rendered.startOverProps.test).toBe(theTestType);
    });
});
