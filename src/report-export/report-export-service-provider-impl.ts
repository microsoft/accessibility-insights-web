// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { HtmlReportExportService } from 'report-export/services/html-report-export-service';
import { JsonReportExportService } from 'report-export/services/json-report-export-service';

export const ReportExportServiceProviderImpl = new ReportExportServiceProvider([
    HtmlReportExportService,
    JsonReportExportService,
    CodePenReportExportService,
]);
