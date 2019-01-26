// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    AssessmentSummaryDetails,
    IAssessmentSummaryDetailsProps,
} from '../../../../../../DetailsView/reports/components/assessment-summary-details';
import { OutcomeChipSet } from '../../../../../../DetailsView/reports/components/outcome-chip-set';
import { OutcomeIconSet } from '../../../../../../DetailsView/reports/components/outcome-icon-set';
import { shallowRender } from '../../../../common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentSummaryDetails', () => {
    describe('render', () => {
        test('Correct composition', () => {
            const props: IAssessmentSummaryDetailsProps = {
                testSummaries: AssessmentReportBuilderTestHelper.getAssessmentsSummaryReportModel().reportSummaryDetailsData,
            };

            expect(shallowRender(<AssessmentSummaryDetails {...props} />)).toMatchSnapshot();
        });

        test('Renders an OutcomeIconSet for 7 items', () => {
            const props: IAssessmentSummaryDetailsProps = {
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
            expect(wrapper.find(OutcomeIconSet)).toHaveLength(1);
            expect(shallowRender(<AssessmentSummaryDetails {...props} />)).toMatchSnapshot();
        });

        test('Renders an OutcomeChipSet for 8 items', () => {
            const props: IAssessmentSummaryDetailsProps = {
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
            expect(wrapper.find(OutcomeChipSet)).toHaveLength(1);
            expect(shallowRender(<AssessmentSummaryDetails {...props} />)).toMatchSnapshot();
        });
    });
});
