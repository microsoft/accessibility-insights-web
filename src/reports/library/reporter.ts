// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { AxeResultReport } from './axe-results-report';

export type AxeResultsReportGenerator = (results: axe.AxeResults) => AxeResultReport;

export class Reporter {
    constructor(private readonly axeResultsReportGenerator: AxeResultsReportGenerator) {}

    public fromAxeResult(results: axe.AxeResults): AxeResultReport {
        return this.axeResultsReportGenerator(results);
    }
}
