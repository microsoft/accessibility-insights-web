// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';

export interface ShouldShowReportExportButtonProps {
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    selectedTest: VisualizationType;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    visualizationStoreData: VisualizationStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
}

export type ShouldShowReportExportButton = (props: ShouldShowReportExportButtonProps) => boolean;

export function shouldShowReportExportButtonForAssessment(
    props: ShouldShowReportExportButtonProps,
): boolean {
    return true;
}

export function shouldShowReportExportButtonForFastpass(
    props: ShouldShowReportExportButtonProps,
): boolean {
    const config = props.visualizationConfigurationFactory.getConfiguration(props.selectedTest);
    const shouldShow = config.shouldShowExportReport(
        props.unifiedScanResultStoreData,
        props.featureFlagStoreData,
    );

    const scanData = config.getStoreData(props.visualizationStoreData.tests);
    const isEnabled = config.getTestStatus(scanData);
    return shouldShow || isEnabled;
}
