// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { FailedInstancesSection } from './failed-instances-section';
import { FooterSection } from './footer-section';
import { HeaderSection } from './header-section';
import { NotApplicableChecksSection } from './not-applicable-section';
import { PassedChecksSection } from './passed-checks-section';
import { ReportSectionFactory } from './report-section-factory';
import { SummarySection } from './summary-section';
import { TitleSection } from './title-section';

const createWrappingComponent = (name: string) => {
    return NamedSFC(name, ({ children }) => {
        return <div id={name}>{children}</div>;
    });
};

const ResultSection = createWrappingComponent('result-section');

// TODO most of this sections are dummy sections, the point is to replace them as we develop them
export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
    BodySection,
    ContentContainer,
    Header: HeaderSection,
    Title: TitleSection,
    Summary: SummarySection,
    Details: DetailsSection,
    ResultSection,
    FailedInstances: FailedInstancesSection,
    PassedChecks: PassedChecksSection,
    NotApplicableChecks: NotApplicableChecksSection,
    Footer: FooterSection,
};
