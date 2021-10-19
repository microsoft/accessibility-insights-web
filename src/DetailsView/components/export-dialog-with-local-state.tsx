// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { ReportExportService } from 'report-export/types/report-export-service';
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
    jsonGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
    reportExportServices: ReportExportService[];
}

interface ExportDialogWithLocalStateState {
    htmlExportName: string;
    htmlExportData: string;
    jsonExportName: string;
    jsonExportData: string;
    exportDescription: string;
}

export class ExportDialogWithLocalState extends React.Component<
    ExportDialogWithLocalStateProps,
    ExportDialogWithLocalStateState
> {
    constructor(props) {
        super(props);
        this.state = {
            htmlExportName: '',
            htmlExportData: '',
            jsonExportName: '',
            jsonExportData: '',
            exportDescription: '',
        };
    }

    private onExportDescriptionChange = (value: string) => {
        this.setState({ exportDescription: value });
        this.props.updatePersistedDescription(value);
    };

    private generateHtml = () => {
        this.setState((prevState, prevProps) => ({
            htmlExportData: prevProps.htmlGenerator(prevState.exportDescription),
        }));
    };

    private generateJson = () => {
        this.setState((prevState, prevProps) => ({
            jsonExportData: prevProps.jsonGenerator(prevState.exportDescription),
        }));
    };

    private generateExports = () => {
        this.generateJson();
        this.generateHtml();
    };

    public render(): JSX.Element {
        const { deps, reportExportFormat, isOpen, featureFlagStoreData } = this.props;

        return (
            <ExportDialog
                deps={deps}
                isOpen={isOpen}
                htmlFileName={this.state.htmlExportName}
                jsonFileName={this.state.jsonExportName}
                description={this.state.exportDescription}
                htmlExportData={this.state.htmlExportData}
                jsonExportData={this.state.jsonExportData}
                onClose={this.props.dismissExportDialog}
                onDescriptionChange={this.onExportDescriptionChange}
                reportExportFormat={reportExportFormat}
                generateExports={this.generateExports}
                featureFlagStoreData={featureFlagStoreData}
                afterDismissed={this.props.afterDialogDismissed}
                reportExportServices={this.props.reportExportServices}
            />
        );
    }

    private generateReportName(fileExtension: string): string {
        const { deps, scanDate, reportExportFormat, pageTitle } = this.props;
        return deps.reportGenerator.generateName(
            reportExportFormat,
            scanDate,
            pageTitle,
            fileExtension,
        );
    }

    private dialogWasOpened(prev: ExportDialogWithLocalStateProps): boolean {
        return this.props.isOpen === true && this.props.isOpen !== prev.isOpen;
    }

    private onDialogOpened(): void {
        this.setState((_, props) => ({
            exportDescription: props.getExportDescription(),
            htmlExportName: this.generateReportName('.html'),
            jsonExportName: this.generateReportName('.json'),
        }));
    }

    public componentDidUpdate(prev: ExportDialogWithLocalStateProps): void {
        if (this.dialogWasOpened(prev)) {
            this.onDialogOpened();
        }
    }
}
