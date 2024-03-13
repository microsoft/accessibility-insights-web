// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
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
    let tabStoreData: TabStoreData;

    const visualizationStoreData = { tests: {} } as VisualizationStoreData;
    const unifiedScanResultStoreData = {} as UnifiedScanResultStoreData;
    const userConfigurationStoreData = {} as UserConfigurationStoreData;

    const selectedTest = -1 as VisualizationType;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(selectedTest))
            .returns(() => visualizationConfigurationMock.object);
        tabStoreData = { isChanged: false } as TabStoreData;
    });

    function getProps(): DetailsViewCommandBarProps {
        return {
            visualizationStoreData: visualizationStoreData,
            unifiedScanResultStoreData: unifiedScanResultStoreData,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
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
            userConfigurationStoreData,
            featureFlagStoreData: null,
            dataTransferViewStoreData: null,
        } as DetailsViewCommandBarProps;
    }

    function setupVisualizationConfigurationMock(shouldShow: boolean): void {
        visualizationConfigurationMock
            .setup(m => m.shouldShowExportReport())
            .returns(() => shouldShow);
    }

    describe('shouldShowReportExportButtonForAssessment', () => {
        test('shouldShowReportExportButtonForAssessment returns true', () => {
            const shouldShowButton = shouldShowReportExportButtonForAssessment();
            expect(shouldShowButton).toBe(true);
        });
    });

    describe('shouldShowReportExportButtonForFastpass', () => {
        test('returns true if shouldShow is true and target page changed is false, ', () => {
            setupVisualizationConfigurationMock(true);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(true);
        });

        test('returns false if shouldShow is true and target page changed is true', () => {
            setupVisualizationConfigurationMock(true);
            const props = getProps();
            props.tabStoreData.isChanged = true;
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(false);
        });

        test('returns false if shouldShow is false', () => {
            setupVisualizationConfigurationMock(false);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(false);
        });
    });
});
