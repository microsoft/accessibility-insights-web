// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportNameGeneratorBuilder } from 'reports/report-name-generator-builder';

export interface ReportNameGenerator {
    generateName(baseName: string, scanDate: Date, pageTitle: string): string;
}

export class WebReportNameGenerator implements ReportNameGenerator {
    constructor(
        private readonly reportNameGeneratorBuilder: ReportNameGeneratorBuilder = new ReportNameGeneratorBuilder(),
    ) {}

    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return (
            baseName +
            '_' +
            this.reportNameGeneratorBuilder.getDateSegment(scanDate) +
            '_' +
            this.reportNameGeneratorBuilder.getTitleSegment(pageTitle) +
            '.html'
        );
    }
}
