// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileNameBuilder } from 'common/filename-builder';

export interface ReportNameGenerator {
    generateName(
        baseName: string,
        scanDate: Date,
        pageTitle: string,
        fileExtension: string,
    ): string;
}

export class WebReportNameGenerator implements ReportNameGenerator {
    constructor(private readonly fileNameBuilder: FileNameBuilder = new FileNameBuilder()) {}

    public generateName(
        baseName: string,
        scanDate: Date,
        pageTitle: string,
        fileExtension: string,
    ): string {
        return (
            baseName +
            '_' +
            this.fileNameBuilder.getDateSegment(scanDate) +
            '_' +
            this.fileNameBuilder.getTitleSegment(pageTitle) +
            fileExtension
        );
    }
}
