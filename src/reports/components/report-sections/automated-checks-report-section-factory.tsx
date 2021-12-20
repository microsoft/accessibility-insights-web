// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { AutomatedChecksHeaderSection } from 'reports/components/report-sections/automated-checks-header-section';
import { WebReportHead } from 'reports/components/web-report-head';
import { AutomatedChecksTitleSection } from './automated-checks-title-section';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { FooterText } from './footer-text';
import { NotApplicableChecksSection } from './not-applicable-checks-section';
import { PassedChecksSection } from './passed-checks-section';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { AllOutcomesSummarySection } from './summary-section';

// This is for a soon-to-be-legacy FastPass report format. It will be replaced by
// FastPassReportSectionFactory with feature #1872889. It should be removed with story #1897885.
export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
    HeadSection: WebReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: AutomatedChecksHeaderSection,
    TitleSection: AutomatedChecksTitleSection,
    SummarySection: AllOutcomesSummarySection,
    DetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection,
    FooterSection: ReportFooter,
    FooterText,
    resultSectionsOrder: ['failed', 'passed', 'notApplicable'],
};
