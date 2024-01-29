// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import * as React from 'react';
import {
    FastPassReportSummary,
    FastPassReportSummaryDeps,
    FastPassReportSummaryProps,
} from 'reports/components/fast-pass-report-summary';
import { IMock, It, Mock, Times } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('FastPassReportSummary', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;
    let props: FastPassReportSummaryProps;
    let deps: FastPassReportSummaryDeps;

    it('renders per the snapshot', () => {
        tabStopsFailedCounterMock = Mock.ofType<TabStopsFailedCounter>();
        deps = { tabStopsFailedCounter: tabStopsFailedCounterMock.object };

        props = {
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
            deps: deps,
        };

        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 2)
            .verifiable(Times.once());

        const renderResult = render(<FastPassReportSummary {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders when automated checks are null', () => {
        tabStopsFailedCounterMock = Mock.ofType<TabStopsFailedCounter>();
        deps = { tabStopsFailedCounter: tabStopsFailedCounterMock.object };

        props = {
            results: {
                automatedChecks: null,
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
            deps: deps,
        };

        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 2)
            .verifiable(Times.once());

        const renderResult = render(<FastPassReportSummary {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
