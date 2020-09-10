// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { FooterText } from './footer-text';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { TitleSection } from './title-section';
import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { NullComponent } from 'common/components/null-component';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { SummaryReportSummarySection } from 'reports/components/report-sections/summary-report-summary-section';
import { SummaryReportHead } from 'reports/components/summary-report-head';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { ResultsByUrlContainer } from 'reports/components/report-sections/results-by-url-container';
import {
    FailedUrlsSection,
    FailedUrlsSectionDeps,
} from 'reports/components/report-sections/failed-urls-section';
import { PassedUrlsSection } from 'reports/components/report-sections/passed-urls-section';
import { NotScannedUrlsSection } from 'reports/components/report-sections/not-scanned-urls-section';

export type SectionDeps = FailedUrlsSectionDeps;

export type ScanTimespan = {
    scanStart: Date;
    scanComplete: Date;
    durationSeconds: number;
};

export type SummaryReportSectionProps = {
    deps: SectionDeps;
    scanTimespan: ScanTimespan;
    toUtcString: (date: Date) => string;
    secondsToTimeString: (seconds: number) => string;
    getCollapsibleScript: () => string;
    scanMetadata: ScanMetadata;
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
    FooterText,
};
