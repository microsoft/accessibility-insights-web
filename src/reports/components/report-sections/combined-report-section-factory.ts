// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSectionDeps } from 'common/components/cards/result-section';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { BaseSummaryReportSectionProps } from 'reports/components/report-sections/base-summary-report-section-props';
import {
    CombinedReportFailedSection,
    CombinedReportFailedSectionProps,
} from 'reports/components/report-sections/combined-report-failed-section';
import {
    CombinedReportNotApplicableSection,
    CombinedReportPassedSection,
} from 'reports/components/report-sections/combined-report-rules-only-sections';
import { CombinedReportSummarySection } from 'reports/components/report-sections/combined-report-summary-section';
import { RulesResultsContainer } from 'reports/components/report-sections/rules-results-container';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { SummaryReportHead } from 'reports/components/summary-report-head';
import { UrlResultCounts } from 'reports/package/accessibilityInsightsReport';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { AutomatedChecksTitleSection } from './automated-checks-title-section';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';

export type CombinedReportSectionDeps = ResultSectionDeps;

export type CombinedReportSectionProps = BaseSummaryReportSectionProps &
    CombinedReportFailedSectionProps & {
        deps: CombinedReportSectionDeps;
        cardsViewData: CardsViewModel;
        urlResultCounts: UrlResultCounts;
        sectionHeadingLevel: HeadingLevel;
        getCopyToClipboardScript: () => string;
        feedbackURL?: string;
    };

export const CombinedReportSectionFactory: ReportSectionFactory<CombinedReportSectionProps> = {
    HeadSection: SummaryReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: SummaryReportHeaderSection,
    TitleSection: AutomatedChecksTitleSection,
    SummarySection: CombinedReportSummarySection,
    DetailsSection: SummaryReportDetailsSection,
    ResultsContainer: RulesResultsContainer,
    FailedInstancesSection: CombinedReportFailedSection,
    PassedChecksSection: CombinedReportPassedSection,
    NotApplicableChecksSection: CombinedReportNotApplicableSection,
    FooterSection: ReportFooter,
    FooterText: FooterTextForService,
    resultSectionsOrder: ['failed', 'passed', 'notApplicable'],
};
