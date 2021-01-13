// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import { ExportDialog, ExportDialogDeps } from './export-dialog';

export type ReportExportComponentDeps = {
    reportGenerator: ReportGenerator;
} & ExportDialogDeps;

export interface ReportExportComponentProps {
    deps: ReportExportComponentDeps;
    reportExportFormat: ReportExportFormat;
    pageTitle: string;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
    onDialogDismiss?: () => void;
}

export interface ReportExportComponentState {
    isOpen: boolean;
    exportName: string;
    exportDescription: string;
    exportData: string;
}

export const exportReportCommandBarButtonId = 'export-report-command-bar-button';

export class ReportExportComponent extends React.Component<
    ReportExportComponentProps,
    ReportExportComponentState
> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            exportName: '',
            exportDescription: '',
            exportData: '',
        };
    }

    private onDismissExportDialog = () => {
        this.setState({ isOpen: false });
    };

    private onExportDescriptionChange = (value: string) => {
        this.props.updatePersistedDescription(value);
        this.setState({ exportDescription: value });
    };

    private generateHtml = () => {
        this.setState((prevState, prevProps) => {
            const { htmlGenerator } = prevProps;

            return {
                exportDescription: '',
                exportData: htmlGenerator(prevState.exportDescription),
            };
        });
    };

    private onExportButtonClick = () => {
        const { deps, reportExportFormat, scanDate, pageTitle } = this.props;
        const exportName = deps.reportGenerator.generateName(
            reportExportFormat,
            scanDate,
            pageTitle,
        );
        const exportDescription = this.props.getExportDescription();
        this.setState({ exportDescription, exportName, isOpen: true });
    };

    public render(): JSX.Element {
        const { deps, reportExportFormat } = this.props;
        const { isOpen, exportName, exportDescription, exportData } = this.state;
        return (
            <>
                <InsightsCommandButton
                    data-automation-id={exportReportCommandBarButtonId}
                    iconProps={{ iconName: 'Export' }}
                    onClick={this.onExportButtonClick}
                >
                    Export result
                </InsightsCommandButton>
                <ExportDialog
                    deps={deps}
                    isOpen={isOpen}
                    fileName={exportName}
                    description={exportDescription}
                    html={exportData}
                    onClose={this.onDismissExportDialog}
                    onDescriptionChange={this.onExportDescriptionChange}
                    reportExportFormat={reportExportFormat}
                    onExportClick={this.generateHtml}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    afterDismissed={this.props.onDialogDismiss}
                />
            </>
        );
    }
}
