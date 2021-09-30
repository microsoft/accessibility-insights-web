// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { FileURLProvider } from 'common/file-url-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ContextualMenu, IContextualMenuItem, IPoint, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';

export interface ExportDropdownState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface ExportDropdownProps {
    onExportLinkClick: (
        event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
        selectedServiceKey: ReportExportServiceKey,
    ) => void;
    reportExportServiceProvider: ReportExportServiceProvider;
    fileName: string;
    html: string;
    fileURLProvider: FileURLProvider;
    featureFlagStoreData: FeatureFlagStoreData;
}

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
            />
        );
    }

    private getMenuItems(): IContextualMenuItem[] {
        const {
            featureFlagStoreData,
            reportExportServiceProvider,
            onExportLinkClick,
            html,
            fileURLProvider,
        } = this.props;

        const exportToCodepen = featureFlagStoreData[FeatureFlags.exportReportOptions];
        const exportToJSON = featureFlagStoreData[FeatureFlags.exportReportJSON];
        const fileURL = fileURLProvider.provideURL([this.props.html], 'text/html');

        const items: IContextualMenuItem[] = [
            reportExportServiceProvider
                .forKey('html')
                .generateMenuItem(onExportLinkClick, fileURL, html),
        ];

        if (exportToJSON) {
            items.push(
                reportExportServiceProvider.forKey('json').generateMenuItem(onExportLinkClick),
            );
        }

        if (exportToCodepen) {
            items.push(
                reportExportServiceProvider.forKey('codepen').generateMenuItem(onExportLinkClick),
            );
        }

        return items;
    }

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
