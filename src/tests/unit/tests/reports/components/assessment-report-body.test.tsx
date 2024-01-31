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
import { AssessmentReportStepHeader } from '../../../../../reports/components/assessment-report-step-header';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
import { AssessmentReportSummary } from '../../../../../reports/components/assessment-report-summary';
import { AssessmentReportAssessmentList } from '../../../../../reports/components/assessment-report-assessment-list';
import { AssessmentScanDetails } from '../../../../../reports/components/assessment-scan-details';
import { OutcomeChip } from '../../../../../reports/components/outcome-chip';
jest.mock('../../../../../reports/components/assessment-report-step-header');
jest.mock('../../../../../reports/components/assessment-report-summary');
jest.mock('../../../../../reports/components/assessment-report-assessment-list');
jest.mock('../../../../../reports/components/assessment-scan-details');
jest.mock('../../../../../reports/components/outcome-chip');

describe('AssessmentReportBody', () => {
    mockReactComponents([
        AssessmentReportStepHeader,
        AssessmentReportSummary,
        AssessmentReportAssessmentList,
        AssessmentScanDetails,
        OutcomeChip,
    ]);
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
        expectMockedComponentPropsToMatchSnapshots([
            AssessmentReportSummary,
            AssessmentReportAssessmentList,
            AssessmentScanDetails,
            OutcomeChip,
        ]);
    });
});
