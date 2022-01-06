// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import {
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
} from 'DetailsView/components/should-show-report-export-button';
import { IMock, Mock } from 'typemoq';

describe('ShouldShowReportExportButton', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationConfigurationMock: IMock<VisualizationConfiguration>;

    const visualizationStoreData = { tests: {} } as VisualizationStoreData;
    const unifiedScanResultStoreData = {} as UnifiedScanResultStoreData;
    const featureFlagStoreData = {} as FeatureFlagStoreData;
    const tabStoreData = {} as TabStoreData;
    const selectedTest = -1 as VisualizationType;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(selectedTest))
            .returns(() => visualizationConfigurationMock.object);
    });

    function getProps(): DetailsViewCommandBarProps {
        return {
            visualizationStoreData: visualizationStoreData,
            unifiedScanResultStoreData: unifiedScanResultStoreData,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
            featureFlagStoreData: featureFlagStoreData,
            selectedTest: selectedTest,
            deps: null,
            tabStoreData: tabStoreData,
            assessmentStoreData: null,
            assessmentsProvider: null,
            rightPanelConfiguration: null,
            automatedChecksCardsViewData: null,
            needsReviewCardsViewData: null,
            switcherNavConfiguration: null,
            scanMetadata: null,
            narrowModeStatus: null,
            tabStopRequirementData: null,
        } as DetailsViewCommandBarProps;
    }

    function setupVisualizationConfigurationMock(shouldShow: boolean): void {
        visualizationConfigurationMock
            .setup(m => m.shouldShowExportReport(tabStoreData, featureFlagStoreData))
            .returns(() => shouldShow);
    }

    describe('shouldShowReportExportButtonForAssessment', () => {
        test('shouldShowReportExportButtonForAssessment returns true', () => {
            const shouldShowButton = shouldShowReportExportButtonForAssessment();
            expect(shouldShowButton).toBe(true);
        });
    });

    describe('shouldShowReportExportButtonForFastpass', () => {
        test('returns true if shouldShow is true, ', () => {
            setupVisualizationConfigurationMock(true);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(true);
        });
    });
});
