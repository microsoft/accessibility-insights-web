// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { ReportExportService } from 'report-export/types/report-export-service';
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
    jsonGenerator: (descriptionPlaceholder: string) => string;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
    onDialogDismiss?: () => void;
    reportExportServices: ReportExportService[];
}

export interface ReportExportComponentState {
    isOpen: boolean;
    htmlExportName: string;
    jsonExportName: string;
    exportDescription: string;
    htmlExportData: string;
    jsonExportData: string;
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
            htmlExportName: '',
            jsonExportName: '',
            exportDescription: '',
            htmlExportData: '',
            jsonExportData: '',
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
                htmlExportData: htmlGenerator(prevState.exportDescription),
            };
        });
    };

    private generateJson = () => {
        this.setState((prevState, prevProps) => ({
            jsonExportData: prevProps.jsonGenerator(prevState.exportDescription),
        }));
    };

    private generateExports = () => {
        this.generateJson();
        this.generateHtml();
        this.setState({ exportDescription: '' });
    };

    private onExportButtonClick = () => {
        const { deps, reportExportFormat, scanDate, pageTitle } = this.props;
        const htmlExportName = deps.reportGenerator.generateName(
            reportExportFormat,
            scanDate,
            pageTitle,
            '.html',
        );
        const jsonExportName = deps.reportGenerator.generateName(
            reportExportFormat,
            scanDate,
            pageTitle,
            '.json',
        );
        const exportDescription = this.props.getExportDescription();
        this.setState({ exportDescription, htmlExportName, jsonExportName, isOpen: true });
    };

    public render(): JSX.Element {
        const { deps, reportExportFormat } = this.props;
        const {
            isOpen,
            htmlExportName,
            jsonExportName,
            exportDescription,
            htmlExportData,
            jsonExportData,
        } = this.state;
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
                    htmlFileName={htmlExportName}
                    jsonFileName={jsonExportName}
                    description={exportDescription}
                    htmlExportData={htmlExportData}
                    jsonExportData={jsonExportData}
                    generateExports={this.generateExports}
                    onClose={this.onDismissExportDialog}
                    onDescriptionChange={this.onExportDescriptionChange}
                    reportExportFormat={reportExportFormat}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    afterDismissed={this.props.onDialogDismiss}
                    reportExportServices={this.props.reportExportServices}
                />
            </>
        );
    }
}
