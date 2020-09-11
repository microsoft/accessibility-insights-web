// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReportSectionFactory, SectionProps, ResultSectionTypes } from './report-section-factory';

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
            FooterSection,
            FooterText,
            resultSectionsOrder,
        } = sectionFactory;

        const getResultSections = () => {
            return resultSectionsOrder.map((sectionKey, i) => {
                const ResultsSection = sectionFactory[ResultSectionTypes[sectionKey]];
                return <ResultsSection key={i} {...sectionProps} />;
            });
        };

        return (
            <BodySection>
                <HeaderSection {...sectionProps} />
                <ContentContainer>
                    <TitleSection />
                    <SummarySection {...sectionProps} />
                    <DetailsSection {...sectionProps} />
                    <ResultsContainer {...sectionProps}>{getResultSections()}</ResultsContainer>
                </ContentContainer>
                <FooterSection>
                    <FooterText {...sectionProps} />
                </FooterSection>
            </BodySection>
        );
    }
}
