// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { ReportHead } from 'reports/components/report-head';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { FooterText } from './footer-text';
import { HeaderSection } from './header-section';
import { NotApplicableChecksSection } from './not-applicable-checks-section';
import { PassedChecksSection } from './passed-checks-section';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { AllOutcomesSummarySection } from './summary-section';
import { TitleSection } from './title-section';

export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
    HeadSection: ReportHead,
    BodySection,
    ContentContainer,
    HeaderSection,
    TitleSection,
    SummarySection: AllOutcomesSummarySection,
    DetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection,
    FooterSection: ReportFooter,
    FooterText,
};
