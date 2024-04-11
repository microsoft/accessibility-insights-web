// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopsInstanceSectionPropsFactory } from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import { TabStopsFailedInstanceSection } from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import * as React from 'react';
import { FastPassReportSummary } from 'reports/components/fast-pass-report-summary';
import { AutomatedChecksHeaderSection } from 'reports/components/report-sections/automated-checks-header-section';
import { BodySection } from 'reports/components/report-sections/body-section';
import { ContentContainer } from 'reports/components/report-sections/content-container';
import { DetailsSection } from 'reports/components/report-sections/details-section';
import { FastPassReportAutomatedChecksResults } from 'reports/components/report-sections/fast-pass-report-automated-checks-results';
import { FastPassResultsTitleSection } from 'reports/components/report-sections/fast-pass-results-title-section';
import { FastPassTitleSection } from 'reports/components/report-sections/fast-pass-title-section';
import { FooterText } from 'reports/components/report-sections/footer-text';
import { IncompleteChecksSection } from 'reports/components/report-sections/incomplete-checks-section';
import { PassedChecksSection } from 'reports/components/report-sections/passed-checks-section';
import { ReportFooter } from 'reports/components/report-sections/report-footer';
import { ResultsContainer } from 'reports/components/report-sections/results-container';
import { TabStopsChecksSectionWrapper } from 'reports/components/report-sections/tab-stops-checks-section-wrapper';
import { SectionDeps, SectionProps } from './report-sections/report-section-factory';
import { WebReportHead } from './web-report-head';

export type FastPassReportResultData = {
    automatedChecks: CardsViewModel;
    tabStops: TabStopRequirementState;
};
export type FastPassReportDeps = {
    tabStopsFailedCounter: TabStopsFailedCounter;
    tabStopsInstanceSectionPropsFactory: TabStopsInstanceSectionPropsFactory;
    featureFlagStoreData: FeatureFlagStoreData;
} & SectionDeps;
export type FastPassReportProps = Omit<
    SectionProps,
    'cardsViewData' | 'userConfigurationStoreData'
> & {
    deps: FastPassReportDeps;
    results: FastPassReportResultData;
};

export const FastPassReport = NamedFC<FastPassReportProps>('FastPassReport', props => (
    <>
        <WebReportHead />
        <BodySection>
            <AutomatedChecksHeaderSection {...props} />
            <ContentContainer>
                <FastPassTitleSection />
                <DetailsSection {...props} />
                <FastPassReportSummary {...props} />
                <ResultsContainer {...props}>
                    <FastPassResultsTitleSection title="Automated checks" />
                    <FastPassReportAutomatedChecksResults {...props} />
                    <FastPassResultsTitleSection key={4} title="Tab stops" />
                    <TabStopsFailedInstanceSection
                        sectionHeadingLevel={props.sectionHeadingLevel}
                        key={5}
                        deps={{
                            tabStopRequirementActionMessageCreator: undefined,
                            tabStopsTestViewController: undefined,
                            ...props.deps,
                        }}
                        tabStopRequirementState={props.results.tabStops}
                        alwaysRenderSection={true}
                    />
                    <TabStopsChecksSectionWrapper
                        key={6}
                        checksSection={IncompleteChecksSection}
                        tabStops={props.results.tabStops}
                        featureFlagStoreData={props.deps.featureFlagStoreData}
                        {...props}
                    />
                    <TabStopsChecksSectionWrapper
                        key={7}
                        checksSection={PassedChecksSection}
                        tabStops={props.results.tabStops}
                        featureFlagStoreData={props.deps.featureFlagStoreData}
                        {...props}
                    />
                </ResultsContainer>
            </ContentContainer>
            <ReportFooter>
                <FooterText {...props} />
            </ReportFooter>
        </BodySection>
    </>
));
