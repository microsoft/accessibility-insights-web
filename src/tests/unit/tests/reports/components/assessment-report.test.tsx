// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { AssessmentReport, AssessmentReportDeps } from 'reports/components/assessment-report';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';
import { AssessmentReportStepHeader } from '../../../../../reports/components/assessment-report-step-header';
import { FormattedDate } from '../../../../../reports/components/formatted-date';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
jest.mock('../../../../../reports/components/assessment-report-step-header');
jest.mock('../../../../../reports/components/formatted-date');

describe('AssessmentReport', () => {
    mockReactComponents([AssessmentReportStepHeader, FormattedDate]);
    test('render', () => {
        const deps: AssessmentReportDeps = {
            outcomeTypeSemanticsFromTestStatus: {
                stub: 'outcomeTypeSemanticsFromTestStatus',
            } as any,
        } as AssessmentReportDeps;

        const data = AssessmentReportBuilderTestHelper.getAssessmentReportModel();

        const bodyHeader = <AssessmentReportBodyHeader />;

        const renderResult = render(
            <AssessmentReport
                deps={deps}
                data={data}
                bodyHeader={bodyHeader}
                description="test string"
                extensionVersion="ProductVersion"
                axeVersion="axeVersion"
                chromeVersion="chromeVersion"
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
