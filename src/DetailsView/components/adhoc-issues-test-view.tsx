// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import styles from 'DetailsView/components/adhoc-issues-test-view.scss';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { CardViewResultsHandlerCallback } from 'DetailsView/components/card-view-results-handler';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ScanIncompleteWarningDeps } from 'DetailsView/components/scan-incomplete-warning';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import * as React from 'react';
import { NamedFC, ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsListIssuesView, DetailsListIssuesViewDeps } from './details-list-issues-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocIssuesTestViewDeps = DetailsListIssuesViewDeps & ScanIncompleteWarningDeps;

export type AdhocIssuesTestViewProps = {
    deps: AdhocIssuesTestViewDeps;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewStoreData: CardsViewStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
    instancesSection: ReactFCWithDisplayName<CommonInstancesSectionProps>;
    narrowModeStatus: NarrowModeStatus;
    handleCardCountResults: CardViewResultsHandlerCallback;
};

export const AdhocIssuesTestView = NamedFC<AdhocIssuesTestViewProps>(
    'AdhocIssuesTestView',
    props => {
        const view = props.tabStoreData.isChanged
            ? createTargetPageChangedView(props)
            : createTestView(props);

        return <div className={styles.issuesTestView}>{view}</div>;
    },
);

function createTargetPageChangedView(props: AdhocIssuesTestViewProps): JSX.Element {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(
        selectedTest,
        !scanData.enabled,
    );

    return (
        <TargetPageChangedView
            displayableData={props.configuration.displayableData}
            visualizationType={selectedTest}
            toggleClickHandler={clickHandler}
            detailsViewActionMessageCreator={props.deps.detailsViewActionMessageCreator}
        />
    );
}

function createTestView(props: AdhocIssuesTestViewProps): JSX.Element {
    return (
        <>
            <BannerWarnings
                deps={props.deps}
                warnings={props.scanIncompleteWarnings}
                warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                test={props.selectedTest}
                visualizationStoreData={props.visualizationStoreData}
            />
            <DetailsListIssuesView {...props} />
        </>
    );
}
