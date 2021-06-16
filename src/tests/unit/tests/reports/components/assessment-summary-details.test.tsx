// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    AssessmentSummaryDetails,
    AssessmentSummaryDetailsProps,
} from 'reports/components/assessment-summary-details';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';

describe('AssessmentSummaryDetails', () => {
    describe('render', () => {
        test('Correct composition', () => {
            const props: AssessmentSummaryDetailsProps = {
                testSummaries:
                    AssessmentReportBuilderTestHelper.getAssessmentsSummaryReportModel()
                        .reportSummaryDetailsData,
            };

            const wrapper = shallow(<AssessmentSummaryDetails {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('Renders an OutcomeIconSet for 7 items', () => {
            const props: AssessmentSummaryDetailsProps = {
                testSummaries: [
                    {
                        displayName: 'test',
                        pass: 0,
                        fail: 0,
                        incomplete: 7,
                    },
                ],
            };

            const wrapper = shallow(<AssessmentSummaryDetails {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('Renders an OutcomeChipSet for 8 items', () => {
            const props: AssessmentSummaryDetailsProps = {
                testSummaries: [
                    {
                        displayName: 'test',
                        pass: 0,
                        fail: 0,
                        incomplete: 8,
                    },
                ],
            };

            const wrapper = shallow(<AssessmentSummaryDetails {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
