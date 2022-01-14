// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { ReporterHeaderSection } from 'reports/components/report-sections/reporter-header-section';
import { ReporterHead } from 'reports/components/reporter-automated-check-head';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { AutomatedChecksTitleSection } from './automated-checks-title-section';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { NotApplicableChecksSection } from './not-applicable-checks-section';
import { PassedChecksSection } from './passed-checks-section';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { AllOutcomesSummarySection } from './summary-section';

export const AxeResultsReportSectionFactory: ReportSectionFactory = {
    BodySection,
    ContentContainer,
    TitleSection: AutomatedChecksTitleSection,
    SummarySection: AllOutcomesSummarySection,
    DetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection,
    FooterSection: ReportFooter,
    resultSectionsOrder: ['failed', 'passed', 'notApplicable'],
    FooterText: FooterTextForService,
    HeaderSection: ReporterHeaderSection,
    HeadSection: ReporterHead,
};
