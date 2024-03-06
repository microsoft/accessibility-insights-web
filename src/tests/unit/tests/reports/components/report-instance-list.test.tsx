// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { ReportInstanceList } from 'reports/components/report-instance-list';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';

describe('ReportInstanceListTest', () => {
    describe('render', () => {
        test('snippet and path', () => {
            const props = {
                instances:
                    AssessmentReportBuilderTestHelper.getInstanceReportModelStep1PassStep2Fail(),
            };

            const renderResult = render(<ReportInstanceList {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('comment', () => {
            const props = {
                instances:
                    AssessmentReportBuilderTestHelper.getInstanceReportModelManualStep4Fail(),
            };

            const renderResult = render(<ReportInstanceList {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('object prop value instance', () => {
            const props = {
                instances: AssessmentReportBuilderTestHelper.getInstanceWithObjectValueProp(),
            };

            const renderResult = render(<ReportInstanceList {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('simple rows first - property bag rows second', () => {
            const props = {
                instances:
                    AssessmentReportBuilderTestHelper.getInstanceWithMixOfSimpleAndComplexValues(),
            };

            const renderResult = render(<ReportInstanceList {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
