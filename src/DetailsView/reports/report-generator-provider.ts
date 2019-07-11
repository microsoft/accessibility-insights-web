// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentReportHtmlGenerator } from './assessment-report-html-generator';
import { ReportGenerator } from './report-generator';
import { ReportGeneratorImpl } from './report-generator-v2';
import { ReportHtmlGenerator } from './report-html-generator';
import { ReportNameGenerator } from './report-name-generator';

export type ReportGeneratorProvider = {
    getGenerator(): ReportGenerator;
};

export const createReportGeneratorProvider = (
    reportNameGenerator: ReportNameGenerator,
    newReportHtmlGenerator: ReportHtmlGenerator,
    assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
): ReportGeneratorProvider => {
    const getGenerator = () => {
        return new ReportGeneratorImpl(reportNameGenerator, newReportHtmlGenerator, assessmentReportHtmlGenerator);
    };

    return {
        getGenerator,
    };
};
