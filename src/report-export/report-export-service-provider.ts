// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExportFormat, ReportExportService } from 'report-export/types/report-export-service';

export class ReportExportServiceProvider {
    constructor(private readonly services: ReportExportService[]) {}

    public all(): ReportExportService[] {
        return this.services;
    }

    public forKey(key: ExportFormat): ReportExportService {
        return this.services.find(service => service.key === key);
    }
}
