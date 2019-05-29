// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanResults } from '../../scanner/iruleresults';

export interface ReportHtmlGenerator {
    generateHtml(scanResult: ScanResults, scanDate: Date, pageTitle: string, pageUrl: string, description: string): string;
}
