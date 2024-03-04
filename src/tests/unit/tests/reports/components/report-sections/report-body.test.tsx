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
import { AutomatedChecksTitleSection } from '../../../../../../reports/components/report-sections/automated-checks-title-section';
import { BodySection } from '../../../../../../reports/components/report-sections/body-section';
import { ContentContainer } from '../../../../../../reports/components/report-sections/content-container';
import { DetailsSection } from '../../../../../../reports/components/report-sections/details-section';
import { FooterSection } from '../../../../../../reports/components/report-sections/footer-section';
import { FooterText } from '../../../../../../reports/components/report-sections/footer-text';
import { HeaderSection } from '../../../../../../reports/components/report-sections/header-section';
import { NotApplicableChecksSection } from '../../../../../../reports/components/report-sections/not-applicable-checks-section';
import { PassedChecksSection } from '../../../../../../reports/components/report-sections/passed-checks-section';
import { ReporterHeaderSection } from '../../../../../../reports/components/report-sections/reporter-header-section';
import { ResultsContainer } from '../../../../../../reports/components/report-sections/results-container';
import { AllOutcomesSummarySection } from '../../../../../../reports/components/report-sections/summary-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
import { exampleUnifiedStatusResults } from '../../../common/components/cards/sample-view-model-data';

jest.mock('../../../../../../reports/components/report-sections/body-section');
jest.mock('../../../../../../reports/components/report-sections/content-container');
jest.mock('../../../../../../reports/components/report-sections/header-section');
jest.mock('../../../../../../reports/components/report-sections/summary-section');
jest.mock('../../../../../../reports/components/report-sections/footer-section');

jest.mock('../../../../../../reports/components/report-sections/automated-checks-title-section');
jest.mock('../../../../../../reports/components/report-sections/details-section');
jest.mock('../../../../../../reports/components/report-sections/reporter-header-section');
jest.mock('../../../../../../reports/components/report-sections/footer-text');
jest.mock('../../../../../../reports/components/report-sections/results-container');
jest.mock('../../../../../../common/components/cards/failed-instances-section');
jest.mock('../../../../../../reports/components/report-sections/passed-checks-section');
jest.mock('../../../../../../reports/components/report-sections/not-applicable-checks-section');
describe('ReportBody', () => {
    mockReactComponents([
        BodySection,
        ContentContainer,
        HeaderSection,
        AllOutcomesSummarySection,
        FooterSection,
        AutomatedChecksTitleSection,
        DetailsSection,
        ReporterHeaderSection,
        FooterText,
        ResultsContainer,
        FailedInstancesSection,
        PassedChecksSection,
        NotApplicableChecksSection,
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
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            HeaderSection,
            DetailsSection,
            AllOutcomesSummarySection,
            ResultsContainer,
            FailedInstancesSection,
            PassedChecksSection,
            NotApplicableChecksSection,
            FooterText,
        ]);
    });

    const createSectionFactoryStub = () => {
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
