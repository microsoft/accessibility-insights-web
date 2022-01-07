// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { shallow } from 'enzyme';
import * as React from 'react';
import {
    FastPassReportSummary,
    FastPassReportSummaryProps,
} from 'reports/components/fast-pass-report-summary';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('FastPassReportSummary', () => {
    it('renders per the snapshot', () => {
        const props: FastPassReportSummaryProps = {
            results: {
                automatedChecks: {
                    cards: exampleUnifiedStatusResults,
                    visualHelperEnabled: true,
                    allCardsCollapsed: true,
                },
                tabStops: null,
            },
        };
        const rendered = shallow(<FastPassReportSummary {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
