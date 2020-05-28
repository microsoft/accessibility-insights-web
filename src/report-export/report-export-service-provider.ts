// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

export class ReportExportServiceProvider {
    constructor(private readonly services: ReportExportService[]) {}

    public all(): ReportExportService[] {
        return this.services;
    }

    public forKey(key: ReportExportServiceKey): ReportExportService {
        return this.services.find(service => service.key === key);
    }
}
