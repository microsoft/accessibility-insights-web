// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IContextualMenuItem } from 'office-ui-fabric-react';

export type ReportExportServiceKey = 'html' | 'codepen' | 'json';

export type ReportExportFormProps = ReportExportProps & { onSubmit: () => void };

export type ReportExportProps = {
    html: string;
    fileName: string;
    description: string;
};

export type ReportExportService = {
    key: ReportExportServiceKey;
    generateMenuItem: (
        onMenuItemClick: (
            event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
            selectedServiceKey: ReportExportServiceKey,
        ) => void,
        href?: string,
        download?: string,
    ) => IContextualMenuItem;
    exportForm?: React.ComponentType<ReportExportFormProps>;
};
