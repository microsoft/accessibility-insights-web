// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import {
    FastPassReport,
    FastPassReportDeps,
    FastPassReportProps,
} from 'reports/components/fast-pass-report';
import { Mock } from 'typemoq';
import { TabStopsFailedInstanceSection } from '../../../../../DetailsView/components/tab-stops-failed-instance-section';
import { FastPassReportSummary } from '../../../../../reports/components/fast-pass-report-summary';
import { AutomatedChecksHeaderSection } from '../../../../../reports/components/report-sections/automated-checks-header-section';
import { BodySection } from '../../../../../reports/components/report-sections/body-section';
import { ContentContainer } from '../../../../../reports/components/report-sections/content-container';
import { DetailsSection } from '../../../../../reports/components/report-sections/details-section';
import { FastPassReportAutomatedChecksResults } from '../../../../../reports/components/report-sections/fast-pass-report-automated-checks-results';
import { FastPassResultsTitleSection } from '../../../../../reports/components/report-sections/fast-pass-results-title-section';
import { FastPassTitleSection } from '../../../../../reports/components/report-sections/fast-pass-title-section';
import { FooterText } from '../../../../../reports/components/report-sections/footer-text';
import { ReportFooter } from '../../../../../reports/components/report-sections/report-footer';
import { ResultsContainer } from '../../../../../reports/components/report-sections/results-container';
import { TabStopsChecksSectionWrapper } from '../../../../../reports/components/report-sections/tab-stops-checks-section-wrapper';
import { WebReportHead } from '../../../../../reports/components/web-report-head';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';
jest.mock('../../../../../reports/components/web-report-head');
jest.mock('../../../../../DetailsView/components/tab-stops-failed-instance-section');
jest.mock('../../../../../reports/components/report-sections/body-section');
jest.mock('../../../../../reports/components/fast-pass-report-summary');
jest.mock('../../../../../reports/components/report-sections/automated-checks-header-section');
jest.mock('../../../../../reports/components/report-sections/content-container');
jest.mock('../../../../../reports/components/report-sections/fast-pass-title-section');
jest.mock('../../../../../reports/components/report-sections/details-section');
jest.mock(
    '../../../../../reports/components/report-sections/fast-pass-report-automated-checks-results',
);
jest.mock('../../../../../reports/components/report-sections/report-footer');
jest.mock('../../../../../reports/components/report-sections/footer-text');
jest.mock('../../../../../reports/components/report-sections/results-container');
jest.mock('../../../../../reports/components/report-sections/fast-pass-results-title-section');
jest.mock('../../../../../reports/components/report-sections/tab-stops-checks-section-wrapper');

describe(FastPassReport.displayName, () => {
    mockReactComponents([
        WebReportHead,
        BodySection,
        AutomatedChecksHeaderSection,
        ContentContainer,
        FastPassTitleSection,
        DetailsSection,
        FastPassReportSummary,
        ResultsContainer,
        FastPassResultsTitleSection,
        FastPassReportAutomatedChecksResults,
        TabStopsFailedInstanceSection,
        TabStopsChecksSectionWrapper,
        ReportFooter,
        FooterText,
    ]);
    it('renders', () => {
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

        const props: FastPassReportProps = {
            deps: {} as FastPassReportDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            recommendColor: recommendColorMock.object,
            description: 'test description',
            toUtcString: () => '',
            getCollapsibleScript: getScriptStub,
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            results: {
                automatedChecks: {
                    cards: exampleUnifiedStatusResults,
                    visualHelperEnabled: true,
                    allCardsCollapsed: true,
                },
                tabStops: {
                    'keyboard-traps': {
                        status: 'pass',
                        instances: [{ id: 'test-id-2', description: 'test desc 2' }],
                        isExpanded: false,
                    },
                    'tab-order': {
                        status: 'fail',
                        instances: [{ id: 'test-id-4', description: 'test desc 4' }],
                        isExpanded: false,
                    },
                },
            },
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

        const renderResult = render(<FastPassReport {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
