// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { AssessmentReport, AssessmentReportDeps } from 'reports/components/assessment-report';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';
import { AssessmentReportBody } from '../../../../../reports/components/assessment-report-body';
import { AssessmentReportFooter } from '../../../../../reports/components/assessment-report-footer';
import { HeaderSection } from '../../../../../reports/components/report-sections/header-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
jest.mock('../../../../../reports/components/report-sections/header-section');
jest.mock('../../../../../reports/components/assessment-report-body');
jest.mock('../../../../../reports/components/assessment-report-footer');

describe('AssessmentReport', () => {
    mockReactComponents([HeaderSection, AssessmentReportBody, AssessmentReportFooter]);
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
        expectMockedComponentPropsToMatchSnapshots([HeaderSection, AssessmentReportBody]);
    });
});
