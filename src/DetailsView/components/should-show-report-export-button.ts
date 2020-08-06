// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// import { VisualizationType } from 'common/types/visualization-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';

export type ShouldShowReportExportButton = (props: CommandBarProps) => boolean;

export function shouldShowReportExportButtonForAssessment(props: CommandBarProps): boolean {
    return true;
}

export function shouldShowReportExportButtonForFastpass(props: CommandBarProps): boolean {
    const config = props.visualizationConfigurationFactory.getConfiguration(props.selectedTest);

    const shouldShow = config.shouldShowExportReport(props.unifiedScanResultStoreData);

    const scanData = config.getStoreData(props.visualizationStoreData.tests);
    const isEnabled = config.getTestStatus(scanData);

    return shouldShow && isEnabled;
}
