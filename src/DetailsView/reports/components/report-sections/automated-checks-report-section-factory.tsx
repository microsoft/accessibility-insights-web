// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { DetailsSection } from './details-section';
import { FooterSection } from './footer-section';
import { HeaderSection } from './header-section';
import { ReportSectionFactory } from './report-section-factory';
import { TitleSection } from './title-section';

const createBasicComponent = (name: string) => {
    return NamedSFC(name, () => {
        return <div id={name} />;
    });
};

const createWrappingComponent = (name: string) => {
    return NamedSFC(name, ({ children }) => {
        return <div id={name}>{children}</div>;
    });
};

const Summary = createBasicComponent('summary-section');
const ResultSection = createWrappingComponent('result-section');
const FailedInstances = createBasicComponent('failed-instances-section');
const PassedChecks = createBasicComponent('passed-checks-section');
const NotApplicableChecks = createBasicComponent('not-applicable-checks-section');

// TODO most of this sections are dummy sections, the point is to replace them as we develop them
export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
    BodySection,
    ContentContainer,
    Header: HeaderSection,
    Title: TitleSection,
    Summary,
    Details: DetailsSection,
    ResultSection,
    FailedInstances,
    PassedChecks,
    NotApplicableChecks,
    Footer: FooterSection,
};
