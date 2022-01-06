// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationType } from 'common/types/visualization-type';

export interface ShouldShowReportExportButtonProps {
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    selectedTest: VisualizationType;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
}

export type ShouldShowReportExportButton = (props: ShouldShowReportExportButtonProps) => boolean;

export function shouldShowReportExportButtonForAssessment(): boolean {
    return true;
}

export function shouldShowReportExportButtonForFastpass(
    props: ShouldShowReportExportButtonProps,
): boolean {
    const config = props.visualizationConfigurationFactory.getConfiguration(props.selectedTest);
    return config.shouldShowExportReport(props.tabStoreData, props.featureFlagStoreData);
}
