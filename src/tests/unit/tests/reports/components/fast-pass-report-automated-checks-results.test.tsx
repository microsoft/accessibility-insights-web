// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import { FastPassReportDeps } from 'reports/components/fast-pass-report';
import {
    FastPassReportAutomatedChecksResults,
    FastPassReportAutomatedChecksResultsProps,
} from 'reports/components/report-sections/fast-pass-report-automated-checks-results';
import { Mock } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';
import { CollapsibleResultSection } from '../../../../../reports/components/report-sections/collapsible-result-section';
import { ResultSection } from '../../../../../common/components/cards/result-section';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../reports/components/report-sections/collapsible-result-section');
jest.mock('../../../../../common/components/cards/result-section');

describe('FastPassReportSummary', () => {
    mockReactComponents([CollapsibleResultSection, ResultSection]);
    let props: FastPassReportAutomatedChecksResultsProps;
    beforeEach(() => {
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
        props = {
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
                tabStops: null, // Should be filled in as part of #1897876
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
    });

    it('renders with pass/fail/incomplete elements if automated checks exist', () => {
        const renderResult = render(<FastPassReportAutomatedChecksResults {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders automated checks not run message if automated checks are null', () => {
        props.results.automatedChecks = null;
        const renderResult = render(<FastPassReportAutomatedChecksResults {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
