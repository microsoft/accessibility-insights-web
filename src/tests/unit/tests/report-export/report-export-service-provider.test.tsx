// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportExportService } from 'report-export/types/report-export-service';

describe('ReportExportServiceProvider', () => {
    const reportExportServices: ReportExportService[] = [
        { key: 'html', generateMenuItem: null },
        { key: 'codepen', generateMenuItem: null },
        { key: 'json', generateMenuItem: null },
    ];
    let reportExportServiceProvider: ReportExportServiceProvider;

    beforeAll(() => {
        reportExportServiceProvider = new ReportExportServiceProvider(reportExportServices);
    });

    test('returns correct services for fastpass', () => {
        const expectedServices = [
            { key: 'html', generateMenuItem: null },
            { key: 'codepen', generateMenuItem: null },
        ];

        const services = reportExportServiceProvider.servicesForFastPass();

        expect(services).toEqual(expectedServices);
    });

    test('returns correct services for assessment', () => {
        const expectedServices = [
            { key: 'html', generateMenuItem: null },
            { key: 'codepen', generateMenuItem: null },
            { key: 'json', generateMenuItem: null },
        ];

        const services = reportExportServiceProvider.servicesForAssessment();

        expect(services).toEqual(expectedServices);
    });
});
