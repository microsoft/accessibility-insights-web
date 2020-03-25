// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { escape } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { ExportResultType } from '../../common/extension-telemetry-events';
import { ExportDialog, ExportDialogDeps } from './export-dialog';

export type ReportExportComponentDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & ExportDialogDeps;

export interface ReportExportComponentProps {
    deps: ReportExportComponentDeps;
    exportResultsType: ExportResultType;
    reportGenerator: ReportGenerator;
    pageTitle: string;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    updatePersistedDescription: (value: string) => void;
    getExportDescription: () => string;
    featureFlagStoreData: FeatureFlagStoreData;
}

export interface ReportExportComponentState {
    isOpen: boolean;
    exportName: string;
    exportDescription: string;
    exportData: string;
}

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
        const escapedExportDescription = escape(value);
        this.setState({ exportDescription: escapedExportDescription });
    };

    private generateHtml = () => {
        const { htmlGenerator } = this.props;
        const exportData = htmlGenerator(this.state.exportDescription);
        this.setState({ exportDescription: '', exportData });
    };

    private onExportButtonClick = () => {
        const { reportGenerator, exportResultsType, scanDate, pageTitle } = this.props;
        const exportName = reportGenerator.generateName(exportResultsType, scanDate, pageTitle);
        const exportDescription = this.props.getExportDescription();
        this.setState({ exportDescription, exportName, isOpen: true });
    };

    public render(): JSX.Element {
        const { deps, exportResultsType } = this.props;
        const { isOpen, exportName, exportDescription, exportData } = this.state;
        return (
            <>
                <ActionButton iconProps={{ iconName: 'Export' }} onClick={this.onExportButtonClick}>
                    Export result
                </ActionButton>
                <ExportDialog
                    deps={deps}
                    isOpen={isOpen}
                    fileName={exportName}
                    description={exportDescription}
                    html={exportData}
                    onClose={this.onDismissExportDialog}
                    onDescriptionChange={this.onExportDescriptionChange}
                    exportResultsType={exportResultsType}
                    onExportClick={this.generateHtml}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                />
            </>
        );
    }
}
