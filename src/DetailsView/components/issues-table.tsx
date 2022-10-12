// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import {
    CommonInstancesSectionDeps,
    CommonInstancesSectionProps,
} from 'common/components/cards/common-instances-section-props';
import { IssueFilingDialogPropsFactory } from 'common/components/get-issue-filing-dialog-props';
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import {
    IssueFilingDialog,
    IssueFilingDialogDeps,
} from 'DetailsView/components/issue-filing-dialog';
import styles from 'DetailsView/components/issues-table.scss';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

export type IssuesTableDeps = CommonInstancesSectionDeps &
    IssueFilingDialogDeps & {
        getDateFromTimestamp: (timestamp: string) => Date;
        reportGenerator: ReportGenerator;
        issueFilingDialogPropsFactory: IssueFilingDialogPropsFactory;
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
    cardSelectionMessageCreator: CardSelectionMessageCreator;
    visualizationStoreData: VisualizationStoreData;
    narrowModeStatus: NarrowModeStatus;
    cardsViewStoreData: CardsViewStoreData;
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

    private getCardCount(): number {
        if (this.props.cardsViewData === null) {
            return 0;
        }
        const { cards } = this.props.cardsViewData;
        let cardCount = 0;
        Object.keys(cards).forEach(key => {
            cardCount += cards[key].length;
        });
        return cardCount;
    }

    private renderContent(): JSX.Element {
        if (this.props.issuesEnabled == null) {
            return this.renderSpinner('Loading...');
        }

        return <div className={styles.issuesTableContent}>{this.renderComponent()}</div>;
    }

    private renderComponent(): JSX.Element {
        const cardCount = this.getCardCount();
        if (!this.props.issuesEnabled && cardCount > 0) {
            this.props.deps.detailsViewActionMessageCreator.enableFastPassVisualHelperWithoutScan(
                this.props.visualizationStoreData.selectedFastPassDetailsView,
            );
        }
        if (!this.props.issuesEnabled && cardCount === 0) {
            this.props.deps.detailsViewActionMessageCreator.rescanVisualizationWithoutTelemetry(
                this.props.visualizationStoreData.selectedFastPassDetailsView,
            );
        }

        if (this.props.scanning) {
            return this.renderSpinner('Scanning...');
        }

        const InstancesSection = this.props.instancesSection;

        return (
            <>
                <InstancesSection
                    deps={this.props.deps}
                    cardsViewData={this.props.cardsViewData}
                    userConfigurationStoreData={this.props.userConfigurationStoreData}
                    scanMetadata={this.props.scanMetadata}
                    shouldAlertFailuresCount={true}
                    cardSelectionMessageCreator={this.props.cardSelectionMessageCreator}
                    sectionHeadingLevel={2}
                    narrowModeStatus={this.props.narrowModeStatus}
                    cardsViewStoreData={this.props.cardsViewStoreData}
                />
                {this.renderIssueFilingSettingContent()}
            </>
        );
    }

    private renderSpinner(label: string): JSX.Element {
        return <ScanningSpinner isSpinning={true} label={label} />;
    }

    public renderIssueFilingSettingContent(): JSX.Element | null {
        const { deps, userConfigurationStoreData, cardsViewStoreData } = this.props;
        const { cardInteractionSupport, cardsViewController, issueFilingDialogPropsFactory } = deps;

        if (!cardInteractionSupport.supportsIssueFiling) {
            return null;
        }

        const dialogProps = issueFilingDialogPropsFactory(
            userConfigurationStoreData,
            cardsViewStoreData,
            cardsViewController,
            deps,
        );

        return <IssueFilingDialog {...dialogProps} />;
    }
}
