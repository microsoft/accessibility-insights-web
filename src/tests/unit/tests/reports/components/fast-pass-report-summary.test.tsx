// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    FastPassReportSummary,
    FastPassReportSummaryDeps,
    FastPassReportSummaryProps,
} from 'reports/components/fast-pass-report-summary';
import { IMock, Mock } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('FastPassReportSummary', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;
    let props: FastPassReportSummaryProps;
    let deps: FastPassReportSummaryDeps;

    it('renders per the snapshot', () => {
        tabStopsFailedCounterMock = Mock.ofType(TabStopsFailedCounter);
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
                },
            },
            deps: deps,
        };
        const rendered = shallow(<FastPassReportSummary {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
