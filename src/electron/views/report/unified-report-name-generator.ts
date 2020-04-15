// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportNameGenerator } from 'reports/report-name-generator';

export class UnifiedReportNameGenerator extends ReportNameGenerator {
    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return (
            baseName +
            '_' +
            this.getDateSegment(scanDate) +
            '_' +
            this.getTimeSegment(scanDate) +
            '_' +
            this.getTitleSegment(pageTitle) +
            '.html'
        );
    }

    protected getTimeSegment(scanDate: Date): string {
        return (
            this.padStartWithZero(scanDate.getHours(), 2) +
            this.padStartWithZero(scanDate.getMinutes(), 2) +
            this.padStartWithZero(scanDate.getSeconds(), 2)
        );
    }
}
