// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { ReportSectionFactory, SectionProps } from './report-section-factory';

export type ReportBodyProps = {
    sectionFactory: ReportSectionFactory;
} & SectionProps;

export const ReportBody = NamedFC<ReportBodyProps>('ReportBody', props => {
    const { sectionFactory, ...sectionProps } = props;
    const {
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
        FooterSection,
    } = sectionFactory;

    return (
        <BodySection>
            <HeaderSection {...sectionProps} />
            <ContentContainer>
                <TitleSection />
                <SummarySection {...sectionProps} />
                <DetailsSection {...sectionProps} />
                <ResultsContainer {...sectionProps}>
                    <FailedInstancesSection {...sectionProps} />
                    <PassedChecksSection {...sectionProps} />
                    <NotApplicableChecksSection {...sectionProps} />
                </ResultsContainer>
            </ContentContainer>
            <FooterSection {...sectionProps} />
        </BodySection>
    );
});
