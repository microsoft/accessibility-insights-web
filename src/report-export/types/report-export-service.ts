// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IContextualMenuItem } from '@fluentui/react';

export type ReportExportServiceKey = 'html' | 'codepen' | 'json';

export type ReportExportFormProps = ReportExportProps & { onSubmit: () => void };

export type ReportExportProps = {
    htmlExportData: string;
    htmlFileName: string;
    jsonFileName: string;
    jsonExportData: string;
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
    exportForm?: React.ComponentType<React.PropsWithChildren<ReportExportFormProps>>;
};
