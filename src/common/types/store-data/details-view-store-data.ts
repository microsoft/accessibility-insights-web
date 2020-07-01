// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { CurrentPanel } from './current-panel';

export interface ReportExportDialogData {
    isOpen: boolean;
    exportName: string;
    exportDescription: string;
    exportData: string;
}

export interface DetailsViewStoreData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: CurrentPanel;
    contentPath: string;
    contentTitle: string;
    reportExportData: ReportExportDialogData;
}
