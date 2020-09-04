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
    HeaderSection: null,
    TitleSection,
    SummarySection: null,
    DetailsSection: null,
    ResultsContainer,
    FailedInstancesSection: null,
    PassedChecksSection: null,
    NotApplicableChecksSection: null,
    FooterSection: ReportFooter,
    FooterText,
};
