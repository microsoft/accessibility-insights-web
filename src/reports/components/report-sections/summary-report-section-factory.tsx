// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportHead } from 'reports/components/report-head';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { FooterText } from './footer-text';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { TitleSection } from './title-section';
import {
    CrawlSummaryDetails,
    SummaryScanResults,
} from 'reports/package/accessibilityInsightsReport';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { NullComponent } from 'common/components/null-component';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';

export type SummaryReportSectionProps = {
    scanDetails: CrawlSummaryDetails;
    toUtcString: (date: Date) => string;
    getCollapsibleScript: () => string;
    scanMetadata: ScanMetadata;
    results: SummaryScanResults;
};

export const SummaryReportSectionFactory: ReportSectionFactory<SummaryReportSectionProps> = {
    HeadSection: ReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: SummaryReportHeaderSection,
    TitleSection,
    SummarySection: NullComponent,
    DetailsSection: NullComponent,
    ResultsContainer,
    FailedInstancesSection: NullComponent,
    PassedChecksSection: NullComponent,
    NotApplicableChecksSection: NullComponent,
    FooterSection: ReportFooter,
    FooterText,
};
