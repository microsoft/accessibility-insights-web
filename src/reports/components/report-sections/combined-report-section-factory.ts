// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSectionDeps } from 'common/components/cards/result-section';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { BaseSummaryReportSectionProps } from 'reports/components/report-sections/base-summary-report-section-props';
import {
    CombinedReportFailedResultsSection,
    CombinedReportFailedResultsSectionProps,
} from 'reports/components/report-sections/combined-report-failed-results-section';
import {
    CombinedReportNotApplicableSection,
    CombinedReportPassedSection,
} from 'reports/components/report-sections/combined-report-rules-only-section';
import { CombinedReportSummarySection } from 'reports/components/report-sections/combined-report-summary-section';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { SummaryReportHead } from 'reports/components/summary-report-head';
import { UrlResultCounts } from 'reports/package/accessibilityInsightsReport';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { TitleSection } from './title-section';

export type CombinedReportSectionDeps = ResultSectionDeps;

export type CombinedReportSectionProps = BaseSummaryReportSectionProps &
    CombinedReportFailedResultsSectionProps & {
        deps: CombinedReportSectionDeps;
        cardsViewData: CardsViewModel;
        urlResultCounts: UrlResultCounts;
    };

export const CombinedReportSectionFactory: ReportSectionFactory<CombinedReportSectionProps> = {
    HeadSection: SummaryReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: SummaryReportHeaderSection,
    TitleSection,
    SummarySection: CombinedReportSummarySection,
    DetailsSection: SummaryReportDetailsSection,
    ResultsContainer,
    FailedInstancesSection: CombinedReportFailedResultsSection,
    PassedChecksSection: CombinedReportPassedSection,
    NotApplicableChecksSection: CombinedReportNotApplicableSection,
    FooterSection: ReportFooter,
    FooterText: FooterTextForService,
    resultSectionsOrder: ['failed', 'notApplicable', 'passed'],
};
