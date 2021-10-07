// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

const htmlReportExportServiceKey: ReportExportServiceKey = 'html';

export const reportExportAsHtmlAutomationId = 'report-export-as-html';

export const HtmlReportExportService: ReportExportService = {
    key: htmlReportExportServiceKey,
    generateMenuItem: (onMenuItemClick, href, download) => {
        return {
            key: htmlReportExportServiceKey,
            name: 'as HTML',
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                onMenuItemClick(e, htmlReportExportServiceKey);
            },
            href,
            download,
            'data-automation-id': reportExportAsHtmlAutomationId,
        };
    },
};
