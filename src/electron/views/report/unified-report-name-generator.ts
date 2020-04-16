// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportNameGenerator } from 'reports/report-name-generator';
import { ReportNameGeneratorBuilder } from 'reports/report-name-generator-builder';

export class UnifiedReportNameGenerator implements ReportNameGenerator {
    constructor(
        private readonly reportNameGeneratorBuilder: ReportNameGeneratorBuilder = new ReportNameGeneratorBuilder(),
    ) {}

    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return (
            baseName +
            '_' +
            this.reportNameGeneratorBuilder.getDateSegment(scanDate) +
            '_' +
            this.reportNameGeneratorBuilder.getTimeSegment(scanDate) +
            '_' +
            this.reportNameGeneratorBuilder.getTitleSegment(pageTitle) +
            '.html'
        );
    }
}
