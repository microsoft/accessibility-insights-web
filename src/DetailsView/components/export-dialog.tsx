// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, DialogType, PrimaryButton, TextField } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ExportDropdown } from 'DetailsView/components/export-dropdown';
import * as React from 'react';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';
import { ReportExportFormat } from '../../common/extension-telemetry-events';
import { FileURLProvider } from '../../common/file-url-provider';
import { NamedFC } from '../../common/react/named-fc';
import * as styles from './export-dialog.scss';

export const singleExportToHtmlButtonDataAutomationId = 'single-export-to-html-button';

export interface ExportDialogProps {
    deps: ExportDialogDeps;
    isOpen: boolean;
    htmlFileName: string;
    jsonFileName: string;
    description: string;
    htmlExportData: string;
    jsonExportData: string;
    onClose: () => void;
    onDescriptionChange: (value: string) => void;
    reportExportFormat: ReportExportFormat;
    generateExports: () => void;
    featureFlagStoreData: FeatureFlagStoreData;
    afterDismissed?: () => void;
    reportExportServices: ReportExportService[];
    exportResultsClickedTelemetry: (
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
    ) => void;
}

export interface ExportDialogDeps {
    fileURLProvider: FileURLProvider;
}

export const ExportDialog = NamedFC<ExportDialogProps>('ExportDialog', props => {
    const [serviceKey, setServiceKey] = React.useState<ReportExportServiceKey | null>(null);

    const onDismiss = (): void => {
        props.onClose();
    };

    const onExportLinkClick = (
        event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
        selectedServiceKey: ReportExportServiceKey,
    ): void => {
        props.onDescriptionChange(props.description);
        props.exportResultsClickedTelemetry(props.reportExportFormat, selectedServiceKey, event);
        setServiceKey(selectedServiceKey);
        props.onClose();
    };

    const onDescriptionChange = (event, value: string): void => {
        props.onDescriptionChange(value);
    };

    const htmlFileUrl = props.deps.fileURLProvider.provideURL([props.htmlExportData], 'text/html');
    const exportService = props.reportExportServices.find(s => s.key === serviceKey);
    const ExportForm = exportService ? exportService.exportForm : null;
    const exportToCodepen =
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] &&
        props.reportExportServices.some(s => s.key === 'codepen');
    const exportToJSON = props.reportExportServices.some(s => s.key === 'json');

    const getSingleExportToHtmlButton = () => {
        return (
            <PrimaryButton
                onClick={event => {
                    props.generateExports();
                    onExportLinkClick(event as React.MouseEvent<HTMLAnchorElement>, 'html');
                }}
                download={props.htmlFileName}
                href={htmlFileUrl}
                data-automation-id={singleExportToHtmlButtonDataAutomationId}
            >
                Export
            </PrimaryButton>
        );
    };

    const getMultiOptionExportButton = () => {
        return (
            <>
                <ExportDropdown
                    htmlFileName={props.htmlFileName}
                    jsonFileName={props.jsonFileName}
                    fileURLProvider={props.deps.fileURLProvider}
                    featureFlagStoreData={props.featureFlagStoreData}
                    htmlExportData={props.htmlExportData}
                    jsonExportData={props.jsonExportData}
                    generateExports={props.generateExports}
                    onExportLinkClick={onExportLinkClick}
                    reportExportServices={props.reportExportServices}
                />
                {ExportForm && (
                    <ExportForm
                        htmlFileName={props.htmlFileName}
                        jsonFileName={props.jsonFileName}
                        description={props.description}
                        htmlExportData={props.htmlExportData}
                        jsonExportData={props.jsonExportData}
                        onSubmit={() => {
                            setServiceKey(null);
                        }}
                    />
                )}
            </>
        );
    };

    const renderExportButton = () => {
        if (!(exportToCodepen || exportToJSON)) {
            return getSingleExportToHtmlButton();
        }

        return getMultiOptionExportButton();
    };

    return (
        <Dialog
            hidden={!props.isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Provide result description',
                subText: 'Optional: please describe the result (it will be saved in the report).',
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: styles.exportDialog,
                onDismissed: props.afterDismissed,
            }}
        >
            <TextField
                multiline
                autoFocus
                rows={8}
                resizable={false}
                onChange={onDescriptionChange}
                value={props.description}
                ariaLabel="Provide result description"
            />
            <DialogFooter>{renderExportButton()}</DialogFooter>
        </Dialog>
    );
});
