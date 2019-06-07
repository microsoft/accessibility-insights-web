// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { FailedInstancesSection } from './failed-instances-section';
import { FooterSection } from './footer-section';
import { HeaderSection } from './header-section';
import { NotApplicableChecksSection } from './not-applicable-section';
import { PassedChecksSection } from './passed-checks-section';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { SummarySection } from './summary-section';
import { TitleSection } from './title-section';

export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
    BodySection,
    ContentContainer,
    HeaderSection,
    TitleSection,
    SummarySection,
    DetailsSection,
    ResultsContainer,
    FailedInstancesSection,
    PassedChecksSection,
    NotApplicableChecksSection,
    FooterSection: ReportFooter,
};
