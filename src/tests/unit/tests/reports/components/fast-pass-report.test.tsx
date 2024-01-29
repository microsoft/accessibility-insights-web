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

import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';
import { CollapsibleResultSection } from '../../../../../reports/components/report-sections/collapsible-result-section';
import { TabStopsFailedInstanceSection } from '../../../../../DetailsView/components/tab-stops-failed-instance-section';
import { ResultSection } from '../../../../../common/components/cards/result-section';
import { FastPassReportSummary } from '../../../../../reports/components/fast-pass-report-summary';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../reports/components/report-sections/collapsible-result-section');
jest.mock('../../../../../DetailsView/components/tab-stops-failed-instance-section');
jest.mock('../../../../../common/components/cards/result-section');
jest.mock('../../../../../reports/components/fast-pass-report-summary');

describe(FastPassReport.displayName, () => {
    mockReactComponents([CollapsibleResultSection, TabStopsFailedInstanceSection, ResultSection, FastPassReportSummary]);
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

        const props: FastPassReportProps = {
            deps: {} as FastPassReportDeps,
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

        const renderResult = render(<FastPassReport {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
