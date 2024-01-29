// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    AssessmentReportBody,
    AssessmentReportBodyDeps,
    AssessmentReportBodyProps,
} from 'reports/components/assessment-report-body';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
import { AssessmentReportStepHeader } from '../../../../../reports/components/assessment-report-step-header';
import { FormattedDate } from '../../../../../reports/components/formatted-date';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../reports/components/assessment-report-step-header');
jest.mock('../../../../../reports/components/formatted-date');

describe('AssessmentReportBody', () => {
    mockReactComponents([AssessmentReportStepHeader, FormattedDate])
    test('render', () => {
        const deps: AssessmentReportBodyDeps = {
            outcomeTypeSemanticsFromTestStatus: {
                stub: 'outcomeTypeSemanticsFromTestStatus',
            } as any,
        } as AssessmentReportBodyDeps;

        const bodyHeader = <AssessmentReportBodyHeader />;

        const props: AssessmentReportBodyProps = {
            deps: deps,
            data: AssessmentReportBuilderTestHelper.getAssessmentReportModel(),
            description: 'test-description',
            bodyHeader: bodyHeader,
        };

        const renderResult = render(<AssessmentReportBody {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
