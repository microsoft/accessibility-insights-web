// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { ReportSectionFactory } from './report-section-factory';

const createBasicComponent = (name: string) => {
    return NamedSFC(name, () => {
        return <div />;
    });
};

const BodySection = createBasicComponent('body-section');
const Header = createBasicComponent('header-section');
const Title = createBasicComponent('title-section');
const Summary = createBasicComponent('summary-section');
const Details = createBasicComponent('details-section');
const ResultSection = createBasicComponent('result-section');
const FailedInstances = createBasicComponent('failed-instances-section');
const PassedChecks = createBasicComponent('passed-checks-section');
const NotApplicableChecks = createBasicComponent('not-applicable-checks-section');
const Footer = createBasicComponent('footer-section');

// TODO most of this sections are dummy sections, the point is to replace them as we develop them
export const AutomatedChecksReportSectionFactory: ReportSectionFactory = {
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
};
