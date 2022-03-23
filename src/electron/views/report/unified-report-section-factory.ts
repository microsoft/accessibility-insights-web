// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NullComponent } from 'common/components/null-component';
import { UnifiedDetailsSection } from 'electron/views/report/unified-details-section';
import { UnifiedReportHead } from 'electron/views/report/unified-report-head';
import { AutomatedChecksTitleSection } from 'reports/components/report-sections/automated-checks-title-section';
import { BodySection } from 'reports/components/report-sections/body-section';
import { ContentContainer } from 'reports/components/report-sections/content-container';
import { FooterTextForUnified } from 'reports/components/report-sections/footer-text-for-unified';
import { PassedChecksSection } from 'reports/components/report-sections/passed-checks-section';
import { ReportFooter } from 'reports/components/report-sections/report-footer';
import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { ResultsContainer } from 'reports/components/report-sections/results-container';
import { PassFailSummarySection } from 'reports/components/report-sections/summary-section';
import { UnifiedHeaderSection } from './unified-header-section';

export const UnifiedReportSectionFactory: ReportSectionFactory = {
    HeadSection: UnifiedReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: UnifiedHeaderSection,
    TitleSection: AutomatedChecksTitleSection,
    SummarySection: PassFailSummarySection,
    DetailsSection: UnifiedDetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection: NullComponent,
    FooterSection: ReportFooter,
    FooterText: FooterTextForUnified,
    resultSectionsOrder: ['failed', 'passed', 'notApplicable'],
};
