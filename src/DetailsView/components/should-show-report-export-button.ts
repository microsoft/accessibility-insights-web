// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';

export type ShouldShowReportExportButton = (props: CommandBarProps) => boolean;

export function shouldShowReportExportButtonForAssessment(props: CommandBarProps): boolean {
    return true;
}

export function shouldShowReportExportButtonForFastpass(props: CommandBarProps): boolean {
    const scanResult = props.unifiedScanResultStoreData.results;

    if (!scanResult) {
        return false;
    }

    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;

    if (selectedTest !== VisualizationType.Issues) {
        return false;
    }

    return true;
}
