// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentNavState,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import {
    getStartOverComponentForAssessment,
    getStartOverComponentForFastPass,
} from 'DetailsView/components/start-over-component-factory';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('StartOverComponentPropsFactory', () => {
    const theTitle = 'the title';
    const theTestStep = 'test step';
    const theTestType = VisualizationType.ColorSensoryAssessment;

    let assessment: Readonly<Assessment>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let visualizationScanResultData: VisualizationScanResultData;
    let scanResult: ScanResults;
    let scanning: string;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(
            undefined,
            MockBehavior.Loose,
        );
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
                selectedTestStep: theTestStep,
            } as AssessmentNavState,
        } as AssessmentStoreData;

        return {
            deps,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            visualizationScanResultData,
            visualizationStoreData,
        } as DetailsViewCommandBarProps;
    }

    function setScanResult(): void {
        scanResult = {} as ScanResults;
    }

    test('getStartOverComponentPropsForAssessment, component matches snapshot', () => {
        const props = getProps(true);
        const rendered = getStartOverComponentForAssessment(props);

        expect(rendered).toMatchSnapshot();
    });

    test('getStartOverComponentPropsForFastPass, scanResults is null, component is null', () => {
        const props = getProps(false);
        const rendered = getStartOverComponentForFastPass(props);

        expect(rendered).toBeNull();
    });

    test('getStartOverComponentPropsForFastPass, scanResults is not null, scanning is false, component matches snapshot', () => {
        setScanResult();
        const props = getProps(false);
        const rendered = getStartOverComponentForFastPass(props);

        expect(rendered).toMatchSnapshot();
    });

    test('getStartOverComponentPropsForFastPass, scanResults is not null, scanning is true, component matches snapshot', () => {
        setScanResult();
        scanning = 'some string';
        const props = getProps(false);
        const rendered = getStartOverComponentForFastPass(props);

        expect(rendered).toMatchSnapshot();
    });
});
