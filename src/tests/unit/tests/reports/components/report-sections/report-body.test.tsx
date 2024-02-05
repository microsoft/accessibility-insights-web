// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CommonInstancesSectionDeps } from 'common/components/cards/common-instances-section-props';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import {
    SectionProps,
    ReportSectionFactory,
} from 'reports/components/report-sections/report-section-factory';
import { Mock } from 'typemoq';

import { FailedInstancesSection } from '../../../../../../common/components/cards/failed-instances-section';
import { ResultSection } from '../../../../../../common/components/cards/result-section';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import { NewTabLinkWithConfirmationDialog } from '../../../../../../reports/components/new-tab-link-confirmation-dialog';
import { AutomatedChecksTitleSection } from '../../../../../../reports/components/report-sections/automated-checks-title-section';
import { BodySection } from '../../../../../../reports/components/report-sections/body-section';
import { CollapsibleResultSection } from '../../../../../../reports/components/report-sections/collapsible-result-section';
import { ContentContainer } from '../../../../../../reports/components/report-sections/content-container';
import { DetailsSection } from '../../../../../../reports/components/report-sections/details-section';
import { FooterSection } from '../../../../../../reports/components/report-sections/footer-section';
import { FooterText } from '../../../../../../reports/components/report-sections/footer-text';
import { HeaderSection } from '../../../../../../reports/components/report-sections/header-section';
import { NotApplicableChecksSection } from '../../../../../../reports/components/report-sections/not-applicable-checks-section';
import { PassedChecksSection } from '../../../../../../reports/components/report-sections/passed-checks-section';
import { ReporterHeaderSection } from '../../../../../../reports/components/report-sections/reporter-header-section';
import { ResultsContainer } from '../../../../../../reports/components/report-sections/results-container';
import {
    AllOutcomesSummarySection,
    BaseSummarySection,
} from '../../../../../../reports/components/report-sections/summary-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';
import { exampleUnifiedStatusResults } from '../../../common/components/cards/sample-view-model-data';

jest.mock('../../../../../../reports/components/report-sections/content-container');
jest.mock('../../../../../../reports/components/report-sections/header-section');
jest.mock('../../../../../../reports/components/report-sections/summary-section');
//jest.mock('../../../../../../reports/components/report-sec tions/content-container');
jest.mock('../../../../../../reports/components/report-sections/footer-section');
jest.mock('../../../../../../reports/components/new-tab-link-confirmation-dialog');
jest.mock('../../../../../../common/components/cards/result-section');
jest.mock('../../../../../../reports/components/report-sections/collapsible-result-section');
jest.mock('../../../../../../common/components/new-tab-link');
describe('ReportBody', () => {
    mockReactComponents([
        HeaderSection,
        ContentContainer,
        AllOutcomesSummarySection,
        BaseSummarySection,
        NewTabLinkWithConfirmationDialog,
        ResultSection,
        CollapsibleResultSection,
        NewTabLink,
        FooterSection,
    ]);
    it('renders', () => {
        const pageTitle = 'page-title';
        const pageUrl = 'url:target-page';
        const scanDate = new Date(Date.UTC(0, 1, 2, 3));
        const getScriptStub = () => '';
        const getGuidanceTagsStub = () => [];
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const recommendColorMock = Mock.ofType(RecommendColor);
        const toolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };
        const targetAppInfo = { name: 'app' };

        const detailsProps: SectionProps = {
            deps: {} as CommonInstancesSectionDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            recommendColor: recommendColorMock.object,
            pageTitle,
            pageUrl,
            description: 'test description',
            toolData,
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
            targetAppInfo,
            shouldAlertFailuresCount: false,
            scanMetadata: {
                toolData,
                targetAppInfo,
                timespan: {
                    scanComplete: scanDate,
                },
            },
            sectionHeadingLevel: 3,
        };

        const props: ReportBodyProps = {
            sectionFactory: createSectionFactoryStub(),
            ...detailsProps,
        };

        const renderResult = render(<ReportBody {...props} />);
        renderResult.debug();
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    const createSectionFactoryStub = () => {
        //const createBasicComponent = (name: string) => {
        //    return NamedFC(name, () => {
        //        return <div />;
        //    });
        //};

        //const BodySection = createBasicComponent('body-section');
        //const ContentContainer = createBasicComponent('content-container');
        //const Header = createBasicComponent('header-section');
        //const Title = createBasicComponent('title-section');
        //const Summary = createBasicComponent('summary-section');
        //const Details = createBasicComponent('details-section');
        //const ResultSection = createBasicComponent('result-section');
        //const FailedInstances = createBasicComponent('failed-instances-section');
        //const PassedChecks = createBasicComponent('passed-checks-section');
        //const NotApplicableChecks = createBasicComponent('not-applicable-checks-section');
        //const Footer = createBasicComponent('footer-section');
        //const FooterText = createBasicComponent('footer-text');

        const sectionFactoryStub = {
            BodySection: BodySection,
            ContentContainer: ContentContainer,
            HeaderSection: ReporterHeaderSection,
            TitleSection: AutomatedChecksTitleSection,
            SummarySection: AllOutcomesSummarySection,
            DetailsSection: DetailsSection,
            ResultsContainer: ResultsContainer,
            FailedInstancesSection: FailedInstancesSection,
            PassedChecksSection: PassedChecksSection,
            NotApplicableChecksSection: NotApplicableChecksSection,
            FooterSection: FooterSection,
            FooterText,
            resultSectionsOrder: ['failed', 'passed', 'notApplicable'],
        } as ReportSectionFactory;

        return sectionFactoryStub;
    };
});
