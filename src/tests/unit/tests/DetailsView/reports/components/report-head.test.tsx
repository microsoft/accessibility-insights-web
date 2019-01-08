// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReportHead } from '../../../../../../DetailsView/reports/components/report-head';
import { shallowRender } from '../../../../Common/shallow-render';

describe('ReportHeadTest', () => {
    it('renders', () => {
        expect(shallowRender(<ReportHead />)).toMatchSnapshot();
    });
});
