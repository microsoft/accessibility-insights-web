// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { ExportDialog, ExportDialogDeps } from './export-dialog';

export type ExportDialogWithLocalStateDeps = {
    reportGenerator: ReportGenerator;
} & ExportDialogDeps;

export interface ExportDialogWithLocalStateProps {
    deps: ExportDialogWithLocalStateDeps;
    isOpen: boolean;
    reportExportFormat: ReportExportFormat;
    pageTitle: string;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
}

interface ExportDialogWithLocalStateState {
    exportName: string;
    exportDescription: string;
    exportData: string;
}

export class ExportDialogWithLocalState extends React.Component<
    ExportDialogWithLocalStateProps,
    ExportDialogWithLocalStateState
> {
    constructor(props) {
        super(props);
        this.state = {
            exportName: '',
            exportData: '',
            exportDescription: '',
        };
    }

    private onExportDescriptionChange = (value: string) => {
        this.setState({ exportDescription: value });
        this.props.updatePersistedDescription(value);
    };

    private generateHtml = () => {
        this.setState((prevState, prevProps) => ({
            exportData: prevProps.htmlGenerator(prevState.exportDescription),
            exportDescription: '',
        }));
    };

    public render(): JSX.Element {
        const { deps, reportExportFormat, isOpen, featureFlagStoreData } = this.props;

        return (
            <ExportDialog
                deps={deps}
                isOpen={isOpen}
                fileName={this.state.exportName}
                description={this.state.exportDescription}
                html={this.state.exportData}
                onClose={this.props.dismissExportDialog}
                onDescriptionChange={this.onExportDescriptionChange}
                reportExportFormat={reportExportFormat}
                onExportClick={this.generateHtml}
                featureFlagStoreData={featureFlagStoreData}
                afterDismissed={this.props.afterDialogDismissed}
            />
        );
    }

    private generateReportName(): string {
        const { deps, scanDate, reportExportFormat, pageTitle } = this.props;
        return deps.reportGenerator.generateName(reportExportFormat, scanDate, pageTitle);
    }

    private dialogWasOpened(prev: ExportDialogWithLocalStateProps): boolean {
        return this.props.isOpen === true && this.props.isOpen !== prev.isOpen;
    }

    private onDialogOpened(): void {
        this.setState((_, props) => ({
            exportDescription: props.getExportDescription(),
            exportName: this.generateReportName(),
        }));
    }

    public componentDidUpdate(prev: ExportDialogWithLocalStateProps): void {
        if (this.dialogWasOpened(prev)) {
            this.onDialogOpened();
        }
    }
}
