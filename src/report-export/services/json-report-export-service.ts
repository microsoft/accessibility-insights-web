// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

const jsonReportExportServiceKey: ReportExportServiceKey = 'json';

export const JsonReportExportService: ReportExportService = {
    key: jsonReportExportServiceKey,
    displayName: 'JSON',
    generateMenuItem: (onMenuItemClick, href, download) => {
        return {
            key: jsonReportExportServiceKey,
            name: 'as JSON',
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                onMenuItemClick(e, jsonReportExportServiceKey);
            },
            href,
            download,
        };
    },
};
