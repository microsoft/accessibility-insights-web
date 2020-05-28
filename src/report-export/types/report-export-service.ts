// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ReportExportServiceKey = 'download' | 'codepen';

export type ReportExportFormProps = ReportExportProps & { onSubmit: () => void };

export type ReportExportProps = {
    html: string;
    fileName: string;
    description: string;
};

export type ReportExportService = {
    key: ReportExportServiceKey;
    displayName: string;
    exportForm: React.ComponentType<ReportExportFormProps>;
};
