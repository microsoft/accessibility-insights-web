// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FileURLProvider } from 'common/file-url-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';
import { ReportNameGenerator } from 'reports/report-name-generator';
import { ExportDialog } from './export-dialog';

export type ReportExportComponentDeps = {
    reportNameGenerator: ReportNameGenerator;
    fileURLProvider: FileURLProvider;
};

export interface ReportExportComponentProps {
    deps: ReportExportComponentDeps;
    isOpen: boolean;
    reportExportFormat: ReportExportFormat;
    pageTitle: string | undefined;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    jsonGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
    reportExportServices: ReportExportService[];
    exportResultsClickedTelemetry: (
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
    ) => void;
}

interface ReportExportComponentState {
    htmlExportName: string;
    htmlExportData: string;
    htmlExportUrl: string;
    jsonExportName: string;
    jsonExportData: string;
    jsonExportUrl: string;
    exportDescription: string;
}

export class ReportExportComponent extends React.Component<
    ReportExportComponentProps,
    ReportExportComponentState
> {
    constructor(props) {
        super(props);
        this.state = {
            htmlExportName: '',
            htmlExportData: '',
            htmlExportUrl: '#',
            jsonExportName: '',
            jsonExportData: '',
            jsonExportUrl: '#',
            exportDescription: '',
        };
    }

    private onExportDescriptionChange = (value: string) => {
        this.setState({ exportDescription: value });
        this.props.updatePersistedDescription(value);
    };

    private generateHtml = () => {
        this.setState((prevState, prevProps) => {
            const htmlExportData = prevProps.htmlGenerator(prevState.exportDescription);
            const htmlExportUrl = prevProps.deps.fileURLProvider.provideURL(
                [htmlExportData],
                'text/html',
            );
            return {
                htmlExportData,
                htmlExportUrl,
            };
        });
    };

    private generateJson = () => {
        this.setState((prevState, prevProps) => {
            const jsonExportData = prevProps.jsonGenerator(prevState.exportDescription);
            const jsonExportUrl = prevProps.deps.fileURLProvider.provideURL(
                [jsonExportData],
                'application/json',
            );
            return {
                jsonExportData,
                jsonExportUrl,
            };
        });
    };

    private generateExports = () => {
        this.generateJson();
        this.generateHtml();
    };

    public render(): JSX.Element {
        const { reportExportFormat, isOpen, featureFlagStoreData } = this.props;

        return (
            <ExportDialog
                isOpen={isOpen}
                htmlFileName={this.state.htmlExportName}
                jsonFileName={this.state.jsonExportName}
                description={this.state.exportDescription}
                htmlExportData={this.state.htmlExportData}
                jsonExportData={this.state.jsonExportData}
                htmlFileUrl={this.state.htmlExportUrl}
                jsonFileUrl={this.state.jsonExportUrl}
                onClose={this.props.dismissExportDialog}
                onDescriptionChange={this.onExportDescriptionChange}
                reportExportFormat={reportExportFormat}
                generateExports={this.generateExports}
                featureFlagStoreData={featureFlagStoreData}
                afterDismissed={this.props.afterDialogDismissed}
                reportExportServices={this.props.reportExportServices}
                exportResultsClickedTelemetry={this.props.exportResultsClickedTelemetry}
            />
        );
    }

    private generateReportName(fileExtension: string): string {
        const { deps, scanDate, reportExportFormat, pageTitle } = this.props;
        return deps.reportNameGenerator.generateName(
            reportExportFormat,
            scanDate,
            pageTitle ?? '',
            fileExtension,
        );
    }

    private dialogWasOpened(prev: ReportExportComponentProps): boolean {
        return this.props.isOpen === true && this.props.isOpen !== prev.isOpen;
    }

    private onDialogOpened(): void {
        this.setState((_, props) => ({
            exportDescription: props.getExportDescription(),
            htmlExportName: this.generateReportName('.html'),
            jsonExportName: this.generateReportName('.json'),
        }));
    }

    public componentDidUpdate(prev: ReportExportComponentProps): void {
        if (this.dialogWasOpened(prev)) {
            this.onDialogOpened();
        }
    }
}
