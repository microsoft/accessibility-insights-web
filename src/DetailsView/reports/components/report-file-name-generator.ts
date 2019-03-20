// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type DateProvider = () => Date;

export type ReportFileNameGeneratorDeps = {
    dateProvider: DateProvider;
};

export class ReportFileNameGenerator {
    constructor(private readonly deps: ReportFileNameGeneratorDeps) {}

    public getFileName(baseName: string, extension: string): string {
        const { dateProvider } = this.deps;
        const isoString = dateProvider().toISOString();
        const dateTime = `${isoString.substr(0, 10)} ${isoString.substr(11, 8)}`;
        return `${baseName} ${dateTime}.${extension}`;
    }
}
