// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { escape } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { ExportResultType } from '../../common/telemetry-events';
import { ReportGenerator } from '../reports/report-generator';
import { ExportDialog, ExportDialogDeps } from './export-dialog';

export interface ReportExportComponentProps {
    deps: ExportDialogDeps;
    exportResultsType: ExportResultType;
    reportGenerator: ReportGenerator;
    pageTitle: string;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
}

export const ReportExportComponent = NamedSFC<ReportExportComponentProps>('ReportExportComponent', props => {
    const descriptionPlaceholder: string = 'd68d50a0-8249-464d-b2fd-709049c89ee4';
    const [isOpen, setDialogVisibility] = React.useState(false);
    const [exportName, setExportName] = React.useState('');
    const [exportDescription, setExportDescription] = React.useState('');
    const [exportDataWithPlaceholder, setExportDataWithPlaceholder] = React.useState('');
    const [exportData, setExportData] = React.useState('');

    const onDismissExportDialog = () => {
        setDialogVisibility(false);
    };

    const onExportDescriptionChange = (value: string) => {
        const _exportData = exportDataWithPlaceholder.replace(descriptionPlaceholder, escape(value));
        setExportDescription(value);
        setExportData(_exportData);
    };

    const onExportButtonClick = () => {
        const _exportName = props.reportGenerator.generateName(props.exportResultsType, props.scanDate, props.pageTitle);
        const _exportDataWithPlaceholder = props.htmlGenerator(descriptionPlaceholder);
        const _exportData = _exportDataWithPlaceholder.replace(descriptionPlaceholder, '');
        setExportDescription('');
        setExportName(_exportName);
        setExportDataWithPlaceholder(_exportDataWithPlaceholder);
        setExportData(_exportData);
        setDialogVisibility(true);
    };

    return (
        <>
            <ActionButton iconProps={{ iconName: 'Export' }} onClick={onExportButtonClick}>
                Export result
            </ActionButton>
            <ExportDialog
                deps={props.deps}
                isOpen={isOpen}
                fileName={exportName}
                description={exportDescription}
                html={exportData}
                onClose={onDismissExportDialog}
                onDescriptionChange={onExportDescriptionChange}
                exportResultsType={props.exportResultsType}
            />
        </>
    );
});
