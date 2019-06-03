// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { ReportSectionFactory, SectionProps } from './report-section-factory';

export type ReportBodyProps = {
    sectionFactory: ReportSectionFactory;
} & SectionProps;

export const ReportBody = NamedSFC<ReportBodyProps>('ReportBody', props => {
    const { sectionFactory, ...sectionProps } = props;
    const {
        BodySection,
        Header,
        Title,
        Summary,
        Details,
        ResultSection,
        FailedInstances,
        PassedChecks,
        NotApplicableChecks,
        Footer,
    } = sectionFactory;

    return (
        <BodySection>
            <Header {...sectionProps} />
            <Title />
            <Summary {...sectionProps} />
            <Details {...sectionProps} />
            <ResultSection>
                <FailedInstances {...sectionProps} />
                <PassedChecks {...sectionProps} />
                <NotApplicableChecks {...sectionProps} />
            </ResultSection>
            <Footer />
        </BodySection>
    );
});
