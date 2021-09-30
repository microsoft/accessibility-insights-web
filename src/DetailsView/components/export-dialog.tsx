// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ExportDropdown } from 'DetailsView/components/export-dropdown';
import { Dialog, DialogFooter, DialogType, PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';
import { ReportExportFormat } from '../../common/extension-telemetry-events';
import { FileURLProvider } from '../../common/file-url-provider';
import { NamedFC } from '../../common/react/named-fc';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import * as styles from './export-dialog.scss';

export interface ExportDialogProps {
    deps: ExportDialogDeps;
    isOpen: boolean;
    fileName: string;
    description: string;
    html: string;
    onClose: () => void;
    onDescriptionChange: (value: string) => void;
    reportExportFormat: ReportExportFormat;
    onExportClick: () => void;
    featureFlagStoreData: FeatureFlagStoreData;
    afterDismissed?: () => void;
}

export interface ExportDialogDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    fileURLProvider: FileURLProvider;
    reportExportServiceProvider: ReportExportServiceProvider;
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
        const { detailsViewActionMessageCreator } = props.deps;
        props.onDescriptionChange(props.description);
        detailsViewActionMessageCreator.exportResultsClicked(
            props.reportExportFormat,
            props.html,
            event,
        );
        setServiceKey(selectedServiceKey);
        props.onExportClick();
        props.onClose();
    };

    const onDescriptionChange = (event, value: string): void => {
        props.onDescriptionChange(value);
    };

    const fileURL = props.deps.fileURLProvider.provideURL([props.html], 'text/html');
    const exportService = props.deps.reportExportServiceProvider.forKey(serviceKey);
    const ExportForm = exportService ? exportService.exportForm : null;
    const exportToCodepen = props.featureFlagStoreData[FeatureFlags.exportReportOptions];
    const exportToJSON = props.featureFlagStoreData[FeatureFlags.exportReportJSON];

    const getSingleExportToHtmlButton = () => {
        return (
            <PrimaryButton
                onClick={event =>
                    onExportLinkClick(event as React.MouseEvent<HTMLAnchorElement>, 'html')
                }
                download={props.fileName}
                href={fileURL}
            >
                Export
            </PrimaryButton>
        );
    };

    const getMultiOptionExportButton = () => {
        return (
            <>
                <ExportDropdown
                    fileName={props.fileName}
                    fileURLProvider={props.deps.fileURLProvider}
                    featureFlagStoreData={props.featureFlagStoreData}
                    html={props.html}
                    onExportLinkClick={onExportLinkClick}
                    reportExportServiceProvider={props.deps.reportExportServiceProvider}
                />
                {ExportForm && (
                    <ExportForm
                        fileName={props.fileName}
                        description={props.description}
                        html={props.html}
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
