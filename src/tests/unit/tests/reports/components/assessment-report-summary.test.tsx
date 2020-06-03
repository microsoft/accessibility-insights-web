// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    AssessmentReportSummary,
    AssessmentReportSummaryProps,
} from 'reports/components/assessment-report-summary';

describe('AssessmentReportSummary', () => {
    describe('render', () => {
        test('Reflow UI is disabled', () => {
            const reportData: AssessmentReportSummaryProps = {
                summary: {
                    reportSummaryDetailsData: [],
                },
                featureFlagStoreData: {
                    reflowUI: false,
                } as FeatureFlagStoreData,
            } as AssessmentReportSummaryProps;

            const testObject = new AssessmentReportSummary(reportData);
            const actual = testObject.render();

            expect(actual).toMatchSnapshot();
        });
        test('Reflow UI is enabled', () => {
            const reportData: AssessmentReportSummaryProps = {
                summary: {
                    reportSummaryDetailsData: [],
                },
                featureFlagStoreData: {
                    reflowUI: true,
                } as FeatureFlagStoreData,
            } as AssessmentReportSummaryProps;

            const testObject = new AssessmentReportSummary(reportData);
            const actual = testObject.render();

            expect(actual).toMatchSnapshot();
        });
    });
});
