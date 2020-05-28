// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanDetailsReportModel } from 'reports/assessment-report-model';
import {
    AssessmentScanDetails,
    AssessmentScanDetailsProps,
} from 'reports/components/assessment-scan-details';

describe('AssessmentScanDetails', () => {
    describe('render', () => {
        test('Correct composition', () => {
            const detailsModel: ScanDetailsReportModel = {
                targetPage: 'test-target-page',
                url: 'https://test-url/path/',
                reportDate: new Date(Date.UTC(2018, 9, 22, 12, 29)),
            };
            const props: AssessmentScanDetailsProps = {
                details: detailsModel,
                description: 'test-description',
            };
            const testSubject = new AssessmentScanDetails(props);

            const actual = testSubject.render();

            expect(actual).toMatchSnapshot();
        });
    });
});
