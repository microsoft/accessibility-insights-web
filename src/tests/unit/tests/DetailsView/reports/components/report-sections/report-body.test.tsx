// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { NamedSFC } from '../../../../../../../common/react/named-sfc';
import { ReportBody, ReportBodyProps } from '../../../../../../../DetailsView/reports/components/report-sections/report-body';
import {
    CheckListProps,
    DetailsProps,
    ReportSectionFactory,
    SummaryProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/report-section-factory';

describe('ReportBody', () => {
    it('renders', () => {
        const pageTitle = 'page-title';
        const pageUrl = 'url:target-page';

        const summaryProps: SummaryProps = {
            scanResult: {
                passes: [],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: pageTitle,
                targetPageUrl: pageUrl,
            },
        };
        const detailsProps: DetailsProps = {
            pageTitle,
            pageUrl,
            description: 'test description',
            scanDate: new Date(2019, 5, 29, 9, 47, 0, 0),
            environmentInfo: {
                axeCoreVersion: 'axe-core-version',
                browserSpec: 'browser-spec',
                extensionVersion: 'extension-version',
            },
        };

        const checkListProps: CheckListProps = {
            congratulateIfEmpty: true,
            idPrefix: 'prefix',
            results: [],
            showInstanceCount: true,
            showInstances: true,
        };

        const props: ReportBodyProps = {
            sectionFactory: createSectionFactoryStub(),
            ...summaryProps,
            ...detailsProps,
            ...checkListProps,
        };

        const wrapper = shallow(<ReportBody {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    const createSectionFactoryStub = () => {
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

        const sectionFactoryStub: ReportSectionFactory = {
            BodySection: BodySection,
            Header: Header,
            Title: Title,
            Summary: Summary,
            Details: Details,
            ResultSection: ResultSection,
            FailedInstances: FailedInstances,
            PassedChecks: PassedChecks,
            NotApplicableChecks: NotApplicableChecks,
            Footer: Footer,
        };

        return sectionFactoryStub;
    };
});
