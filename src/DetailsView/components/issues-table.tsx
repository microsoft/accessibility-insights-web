// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommonInstancesSectionDeps,
    CommonInstancesSectionProps,
} from 'common/components/cards/common-instances-section-props';
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { InlineStartOverButton } from 'DetailsView/components/inline-start-over-button';
import * as styles from 'DetailsView/components/issues-table.scss';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { ExportDialogDeps } from './export-dialog';

export type IssuesTableDeps = CommonInstancesSectionDeps &
    ExportDialogDeps & {
        getDateFromTimestamp: (timestamp: string) => Date;
        reportGenerator: ReportGenerator;
    };

export interface IssuesTableProps {
    deps: IssuesTableDeps;
    title: string;
    subtitle?: JSX.Element;
    stepsText: string;
    issuesEnabled: boolean;
    scanning: boolean;
    featureFlags: FeatureFlagStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    instancesSection: ReactFCWithDisplayName<CommonInstancesSectionProps>;
    visualizationStoreData: VisualizationStoreData;
}

export class IssuesTable extends React.Component<IssuesTableProps> {
    public static readonly exportTextareaLabel: string = 'Provide result description';
    public static readonly exportInstructions: string =
        'Optional: please describe the result (it will be saved in the report).';

    constructor(props: IssuesTableProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.issuesTable}>
                {this.renderTitle()}
                {this.renderSubtitle()}
                {this.renderContent()}
            </div>
        );
    }

    private renderTitle(): JSX.Element {
        return (
            <h1>
                {this.props.title}
                {` ${this.props.stepsText}`}
            </h1>
        );
    }

    private renderSubtitle(): JSX.Element {
        if (!this.props.subtitle) {
            return null;
        }
        return <div className={styles.issuesTableSubtitle}>{this.props.subtitle}</div>;
    }

    private renderContent(): JSX.Element {
        if (this.props.issuesEnabled == null) {
            return this.renderSpinner('Loading...');
        }

        return <div className={styles.issuesTableContent}>{this.renderComponent()}</div>;
    }

    private renderComponent(): JSX.Element {
        if (!this.props.issuesEnabled) {
            return this.renderDisabledMessage();
        }

        if (this.props.scanning) {
            return this.renderSpinner('Scanning...');
        }

        const InstancesSection = this.props.instancesSection;

        return (
            <InstancesSection
                deps={this.props.deps}
                cardsViewData={this.props.cardsViewData}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
                scanMetadata={this.props.scanMetadata}
                shouldAlertFailuresCount={true}
            />
        );
    }

    private renderSpinner(label: string): JSX.Element {
        return <ScanningSpinner isSpinning={true} label={label} />;
    }

    private renderDisabledMessage(): JSX.Element {
        const selectedTest = this.props.visualizationStoreData.selectedFastPassDetailsView;
        const startOverButton = (
            <InlineStartOverButton
                selectedTest={selectedTest}
                detailsViewActionMessageCreator={this.props.deps.detailsViewActionMessageCreator}
            />
        );
        const disabledMessage = (
            <span>Use the {startOverButton} button to scan the target page.</span>
        );

        return (
            <>
                <div className={styles.detailsDisabledMessage} role="alert">
                    {disabledMessage}
                </div>
            </>
        );
    }
}
