// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NullComponent } from 'common/components/null-component';
import { UnifiedReportHead } from 'electron/views/report/unified-report-head';
import { BodySection } from 'reports/components/report-sections/body-section';
import { ContentContainer } from 'reports/components/report-sections/content-container';
import { DetailsSection } from 'reports/components/report-sections/details-section';
import { FooterTextForUnified } from 'reports/components/report-sections/footer-text-for-unified';
import { HeaderSection } from 'reports/components/report-sections/header-section';
import { PassedChecksSection } from 'reports/components/report-sections/passed-checks-section';
import { ReportFooter } from 'reports/components/report-sections/report-footer';
import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { ResultsContainer } from 'reports/components/report-sections/results-container';
import { SummarySection } from 'reports/components/report-sections/summary-section';
import { TitleSection } from 'reports/components/report-sections/title-section';

export const UnifiedReportSectionFactory: ReportSectionFactory = {
    HeadSection: UnifiedReportHead,
    BodySection,
    ContentContainer,
    HeaderSection,
    TitleSection,
    SummarySection,
    DetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection: NullComponent,
    FooterSection: ReportFooter,
    FooterText: FooterTextForUnified,
};
