// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { AssessmentReportHeader } from '../../../../../DetailsView/reports/components/assessment-report-header';
import { shallowRender } from '../../../../Common/shallow-render';

describe('AssessmentReportHeader', () => {
    it('renders', () => {
        expect(shallowRender(
            <AssessmentReportHeader
                targetPageUrl="test url"
                targetPageTitle="test title"
            />)).toMatchSnapshot();
    });
});
