// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { AssessmentReportInstanceList } from '../../../../../../DetailsView/reports/components/assessment-report-instance-list';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReportInstanceListTest', () => {
    describe('render', () => {
        test('snippet and path', () => {
            const props = {
                instances: AssessmentReportBuilderTestHelper.getInstanceReportModelStep1PassStep2Fail(),
            };
            const tree = renderer.create(<AssessmentReportInstanceList {...props} />).toJSON();

            expect(tree).toMatchSnapshot();
        });

        test('comment', () => {
            const props = {
                instances: AssessmentReportBuilderTestHelper.getInstanceReportModelManualStep4Fail(),
            };
            const tree = renderer.create(<AssessmentReportInstanceList {...props} />).toJSON();

            expect(tree).toMatchSnapshot();
        });

        test('object prop value instance', () => {
            const props = {
                instances: AssessmentReportBuilderTestHelper.getInstanceWithObjectValueProp(),
            };
            const tree = renderer.create(<AssessmentReportInstanceList {...props} />).toJSON();

            expect(tree).toMatchSnapshot();
        });

        test('simple rows first - property bag rows second', () => {
            const props = {
                instances: AssessmentReportBuilderTestHelper.getInstanceWithMixOfSimpleAndComplexValues(),
            };
            const tree = renderer.create(<AssessmentReportInstanceList {...props} />).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });
});
