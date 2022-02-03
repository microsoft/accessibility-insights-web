// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ContextualMenu, IContextualMenuItem, IPoint, PrimaryButton } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { FileURLProvider } from 'common/file-url-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

export interface ExportDropdownState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface ExportDropdownProps {
    onExportLinkClick: (
        event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
        selectedServiceKey: ReportExportServiceKey,
    ) => void;
    generateExports: () => void;
    reportExportServices: ReportExportService[];
    htmlFileName: string;
    jsonFileName: string;
    htmlExportData: string;
    jsonExportData: string;
    fileURLProvider: FileURLProvider;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const reportExportDropdownAutomationId = 'report-export-dropdown';
export const reportExportDropdownMenuAutomationId = 'report-export-dropdown-menu';

export class ExportDropdown extends React.Component<ExportDropdownProps, ExportDropdownState> {
    constructor(props: ExportDropdownProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <PrimaryButton
                    text="Export"
                    ariaLabel="export options menu"
                    onClick={this.openDropdown}
                    menuIconProps={{
                        iconName: 'ChevronDown',
                    }}
                    data-automation-id={reportExportDropdownAutomationId}
                />
                {this.renderContextMenu()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
        if (!this.state.isContextMenuVisible) {
            return null;
        }

        return (
            <ContextualMenu
                target={this.state.target}
                onDismiss={() => this.dismissDropdown()}
                items={this.getMenuItems()}
                id={reportExportDropdownMenuAutomationId}
            />
        );
    }

    private getMenuItems(): IContextualMenuItem[] {
        const {
            featureFlagStoreData,
            htmlExportData,
            jsonExportData,
            htmlFileName,
            jsonFileName,
            fileURLProvider,
        } = this.props;

        const exportToCodepen = featureFlagStoreData[FeatureFlags.exportReportOptions];
        const htmlFileUrl = fileURLProvider.provideURL([htmlExportData], 'text/html');
        const jsonFileUrl = fileURLProvider.provideURL([jsonExportData], 'application/json');

        const items: IContextualMenuItem[] = [];
        this.tryAddMenuItemForKey('html', items, htmlFileUrl, htmlFileName);
        this.tryAddMenuItemForKey('json', items, jsonFileUrl, jsonFileName);

        if (exportToCodepen) {
            this.tryAddMenuItemForKey('codepen', items);
        }

        return items;
    }

    private tryAddMenuItemForKey(
        key: ReportExportServiceKey,
        items: IContextualMenuItem[],
        href?: string,
        download?: string,
    ) {
        const { reportExportServices, onExportLinkClick } = this.props;

        const service = reportExportServices.find(s => s.key === key);

        if (service === undefined) return;

        items.push(service.generateMenuItem(onExportLinkClick, href, download));
    }

    private openDropdown = (event): void => {
        this.props.generateExports();
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
