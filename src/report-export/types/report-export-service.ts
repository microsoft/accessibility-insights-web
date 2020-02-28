// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';

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
    exportForm: ReactFCWithDisplayName<ExportFormProps> | null;
}
