// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as styles from 'DetailsView/components/issues-table.scss';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { ISelection } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { RuleResult, ScanResults } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

import { CardsView, CardsViewDeps } from './cards-view';
import { ExportDialogDeps } from './export-dialog';
import { IssuesTableHandler } from './issues-table-handler';

export type IssuesTableDeps = CardsViewDeps &
    ExportDialogDeps & {
        getDateFromTimestamp: (timestamp: string) => Date;
        reportGenerator: ReportGenerator;
    };

export interface IssuesTableProps {
    deps: IssuesTableDeps;
    title: string;
    subtitle?: JSX.Element;
    issuesTableHandler: IssuesTableHandler;
    violations: RuleResult[];
    selectedIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult>;
    issuesEnabled: boolean;
    issuesSelection: ISelection;
    pageTitle: string;
    pageUrl: string;
    scanning: boolean;
    toggleClickHandler: (event) => void;
    featureFlags: FeatureFlagStoreData;
    scanResult: ScanResults;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
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
                <h1>{this.props.title}</h1>
                {this.renderSubtitle()}
                {this.renderContent()}
            </div>
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

        if (this.props.violations == null) {
            return this.renderSpinner('Loading data...');
        }

        return (
            <CardsView
                deps={this.props.deps}
                cardsViewData={this.props.cardsViewData}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
                scanMetadata={this.props.scanMetadata}
            />
        );
    }

    private renderSpinner(label: string): JSX.Element {
        return <ScanningSpinner isSpinning={true} label={label} />;
    }

    private renderDisabledMessage(): JSX.Element {
        const disabledMessage = (
            <span>
                Use the <Markup.Term>Start over button</Markup.Term> to scan the target page.
            </span>
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
