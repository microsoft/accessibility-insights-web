// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseSummaryReportSectionProps } from 'reports/components/report-sections/base-summary-report-section-props';
import {
    FailedUrlsSection,
    FailedUrlsSectionDeps,
} from 'reports/components/report-sections/failed-urls-section';
import { NotScannedUrlsSection } from 'reports/components/report-sections/not-scanned-urls-section';
import { PassedUrlsSection } from 'reports/components/report-sections/passed-urls-section';
import { ResultsByUrlContainer } from 'reports/components/report-sections/results-by-url-container';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { SummaryReportSummarySection } from 'reports/components/report-sections/summary-report-summary-section';
import { SummaryReportHead } from 'reports/components/summary-report-head';
import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { TitleSection } from './title-section';

export type SectionDeps = FailedUrlsSectionDeps;

export type SummaryReportSectionProps = BaseSummaryReportSectionProps & {
    deps: SectionDeps;
    results: SummaryScanResults;
};

export const SummaryReportSectionFactory: ReportSectionFactory<SummaryReportSectionProps> = {
    HeadSection: SummaryReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: SummaryReportHeaderSection,
    TitleSection,
    SummarySection: SummaryReportSummarySection,
    DetailsSection: SummaryReportDetailsSection,
    ResultsContainer: ResultsByUrlContainer,
    FailedInstancesSection: FailedUrlsSection,
    PassedChecksSection: PassedUrlsSection,
    NotApplicableChecksSection: NotScannedUrlsSection,
    FooterSection: ReportFooter,
    FooterText: FooterTextForService,
    resultSectionsOrder: ['failed', 'notApplicable', 'passed'],
};
