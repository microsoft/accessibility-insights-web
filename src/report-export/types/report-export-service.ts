// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ExportFormat = 'download' | 'codepen';

export type ExportFormProps = ExportProps & { onSubmit: () => void };

export interface ExportProps {
    html: string;
    fileName: string;
    description: string;
}

export interface ReportExportService {
    key: ExportFormat;
    displayName: string;
    exportForm: React.ComponentType<ExportFormProps> | null;
}
