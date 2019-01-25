// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentReportBodyHeader } from '../../../../../../DetailsView/reports/components/assessment-report-body-header';
import { shallowRender } from '../../../../Common/shallow-render';

describe('AssessmentReportBodyHeader', () => {
    describe('render', () => {
        test('render function test', () => {
            expect(shallowRender(<AssessmentReportBodyHeader />)).toMatchSnapshot();
        });
    });
});
