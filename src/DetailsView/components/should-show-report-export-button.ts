// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationType } from 'common/types/visualization-type';

export interface ShouldShowReportExportButtonProps {
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    selectedTest: VisualizationType;
    tabStoreData: TabStoreData;
}

export type ShouldShowReportExportButton = (props: ShouldShowReportExportButtonProps) => boolean;

export function shouldShowReportExportButtonForAssessment(): boolean {
    return true;
}

export function shouldShowReportExportButtonForMediumPass(): boolean {
    return false;
}

export function shouldShowReportExportButtonForFastpass(
    props: ShouldShowReportExportButtonProps,
): boolean {
    const config = props.visualizationConfigurationFactory.getConfiguration(props.selectedTest);
    const isTargetPageChangedViewVisible = props.tabStoreData.isChanged;
    return config.shouldShowExportReport() && !isTargetPageChangedViewVisible;
}
