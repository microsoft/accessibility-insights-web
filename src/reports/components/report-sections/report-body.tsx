// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReportSectionFactory, SectionProps } from './report-section-factory';

export type ReportBodyProps<SectionPropsType = SectionProps> = {
    sectionFactory: ReportBodySectionFactory<SectionPropsType>;
} & SectionPropsType;

export type ReportBodySectionFactory<SectionPropsType = SectionProps> = Omit<
    ReportSectionFactory<SectionPropsType>,
    'HeadSection'
>;

export class ReportBody<SectionPropsType = SectionProps> extends React.Component<
    ReportBodyProps<SectionPropsType>
> {
    public render(): JSX.Element {
        const sectionFactory = this.props.sectionFactory;
        const sectionProps: SectionPropsType = this.props;
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
            FooterText,
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
                <FooterSection>
                    <FooterText {...sectionProps} />
                </FooterSection>
            </BodySection>
        );
    }
}
