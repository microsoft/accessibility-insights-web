// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSectionDeps } from 'common/components/cards/failed-instances-section';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NamedFC } from 'common/react/named-fc';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { SectionProps } from 'reports/components/report-sections/report-section-factory';
import { Mock, Times } from 'typemoq';

import { EnvironmentInfo, EnvironmentInfoProvider } from 'common/environment-info-provider';
import { exampleUnifiedStatusResults } from '../../../common/components/cards/sample-view-model-data';

describe('ReportBody', () => {
    it('renders', () => {
        const pageTitle = 'page-title';
        const pageUrl = 'url:target-page';
        const getScriptStub = () => '';
        const getGuidanceTagsStub = () => [];
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const environmentInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: 'extension-version',
            browserSpec: 'browser-spec',
            axeCoreVersion: 'axe-core-version',
        };
        environmentInfoProviderMock
            .setup(eipm => eipm.getEnvironmentInfo())
            .returns(() => environmentInfo)
            .verifiable(Times.never());

        const detailsProps: SectionProps = {
            deps: {} as FailedInstancesSectionDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            pageTitle,
            pageUrl,
            description: 'test description',
            scanDate: new Date('2019-05-29T19:12:16.804Z'),
            environmentInfoProvider: environmentInfoProviderMock.object,
            scanResult: {
                passes: [],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: pageTitle,
                targetPageUrl: pageUrl,
            },
            toUtcString: () => '',
            getCollapsibleScript: getScriptStub,
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            userConfigurationStoreData: null,
            targetAppInfo: { name: 'app' },
            shouldAlertFailuresCount: false,
        };

        const props: ReportBodyProps = {
            sectionFactory: createSectionFactoryStub(),
            ...detailsProps,
        };

        const wrapper = shallow(<ReportBody {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();

        environmentInfoProviderMock.verifyAll();
    });

    const createSectionFactoryStub = () => {
        const createBasicComponent = (name: string) => {
            return NamedFC(name, () => {
                return <div />;
            });
        };

        const BodySection = createBasicComponent('body-section');
        const ContentContainer = createBasicComponent('content-container');
        const Header = createBasicComponent('header-section');
        const Title = createBasicComponent('title-section');
        const Summary = createBasicComponent('summary-section');
        const Details = createBasicComponent('details-section');
        const ResultSection = createBasicComponent('result-section');
        const FailedInstances = createBasicComponent('failed-instances-section');
        const PassedChecks = createBasicComponent('passed-checks-section');
        const NotApplicableChecks = createBasicComponent('not-applicable-checks-section');
        const Footer = createBasicComponent('footer-section');
        const FooterText = createBasicComponent('footer-text');

        const sectionFactoryStub = {
            BodySection: BodySection,
            ContentContainer: ContentContainer,
            HeaderSection: Header,
            TitleSection: Title,
            SummarySection: Summary,
            DetailsSection: Details,
            ResultsContainer: ResultSection,
            FailedInstancesSection: FailedInstances,
            PassedChecksSection: PassedChecks,
            NotApplicableChecksSection: NotApplicableChecks,
            FooterSection: Footer,
            FooterText,
        };

        return sectionFactoryStub;
    };
});
