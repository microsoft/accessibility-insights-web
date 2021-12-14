// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopsFailedInstanceSection } from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import * as React from 'react';
import { AutomatedChecksHeaderSection } from 'reports/components/report-sections/automated-checks-header-section';
import { BodySection } from 'reports/components/report-sections/body-section';
import { ContentContainer } from 'reports/components/report-sections/content-container';
import { DetailsSection } from 'reports/components/report-sections/details-section';
import { FastPassResultsTitleSection } from 'reports/components/report-sections/fast-pass-results-title-section';
import { FastPassTitleSection } from 'reports/components/report-sections/fast-pass-title-section';
import { FooterText } from 'reports/components/report-sections/footer-text';
import { PassedChecksSection } from 'reports/components/report-sections/passed-checks-section';
import { ReportFooter } from 'reports/components/report-sections/report-footer';
import { ResultsContainer } from 'reports/components/report-sections/results-container';
import { SectionDeps, SectionProps } from './report-sections/report-section-factory';
import { WebReportHead } from './web-report-head';

export type FastPassReportResultData = {
    automatedChecks: CardsViewModel;
    tabStops: TabStopRequirementState;
};
export type FastPassReportDeps = {
    tabStopsFailedCounter: TabStopsFailedCounter;
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
                <p>Placeholder for combined summary section</p>

                <ResultsContainer {...props}>
                    <FastPassResultsTitleSection title="Automated checks" />
                    <FailedInstancesSection
                        key={1}
                        {...props}
                        userConfigurationStoreData={null}
                        cardsViewData={props.results.automatedChecks}
                    />
                    <p>Placeholder for incomplete checks</p>
                    <PassedChecksSection
                        key={3}
                        {...props}
                        cardsViewData={props.results.automatedChecks}
                    />

                    <FastPassResultsTitleSection key={4} title="Tab stops" />

                    <TabStopsFailedInstanceSection
                        key={5}
                        deps={{
                            tabStopRequirementActionMessageCreator: undefined,
                            tabStopsTestViewController: undefined,
                            ...props.deps,
                        }}
                        tabStopRequirementState={props.results.tabStops}
                    />
                </ResultsContainer>
            </ContentContainer>
            <ReportFooter>
                <FooterText {...props} />
            </ReportFooter>
        </BodySection>
    </>
));
