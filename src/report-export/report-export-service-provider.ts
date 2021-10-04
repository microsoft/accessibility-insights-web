// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

export class ReportExportServiceProvider {
    constructor(private readonly services: ReportExportService[]) {}

    public servicesForFastPass(): ReportExportService[] {
        const keysForFastpass: ReportExportServiceKey[] = ['html', 'codepen'];
        return this.services.filter(s => keysForFastpass.includes(s.key));
    }

    public servicesForAssessment(): ReportExportService[] {
        const keysForAssessment: ReportExportServiceKey[] = ['html', 'json', 'codepen'];
        return this.services.filter(s => keysForAssessment.includes(s.key));
    }
}
