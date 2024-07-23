// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    AssessmentSummaryDetails,
    AssessmentSummaryDetailsProps,
} from 'reports/components/assessment-summary-details';
import { OutcomeChipSet } from '../../../../../reports/components/outcome-chip-set';
import { OutcomeIconSet } from '../../../../../reports/components/outcome-icon-set';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
jest.mock('../../../../../reports/components/outcome-icon-set');
jest.mock('../../../../../reports/components/outcome-chip-set');

describe('AssessmentSummaryDetails', () => {
    mockReactComponents([OutcomeIconSet, OutcomeChipSet]);
    describe('render', () => {
        test('Correct composition', () => {
            const props: AssessmentSummaryDetailsProps = {
                testSummaries:
                    AssessmentReportBuilderTestHelper.getAssessmentsSummaryReportModel()
                        .reportSummaryDetailsData,
            };

            const renderResult = render(<AssessmentSummaryDetails {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
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

            const renderResult = render(<AssessmentSummaryDetails {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
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

            const renderResult = render(<AssessmentSummaryDetails {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
