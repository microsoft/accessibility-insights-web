// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSectionProps } from 'common/components/cards/failed-instances-section';
import { NeedsReviewInstancesSectionProps } from 'common/components/cards/needs-review-instances-section';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    ScanIncompleteWarning,
    ScanIncompleteWarningDeps,
} from 'DetailsView/components/scan-incomplete-warning';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import * as React from 'react';
import { NamedFC, ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsListIssuesView, DetailsListIssuesViewDeps } from './details-list-issues-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type InstancesSectionProps = FailedInstancesSectionProps & NeedsReviewInstancesSectionProps;

export type AdhocIssuesTestViewDeps = DetailsListIssuesViewDeps & ScanIncompleteWarningDeps;

export type AdhocIssuesTestViewProps = {
    deps: AdhocIssuesTestViewDeps;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    instancesSection: ReactFCWithDisplayName<InstancesSectionProps>;
};

export const AdhocIssuesTestView = NamedFC<AdhocIssuesTestViewProps>(
    'AdhocIssuesTestView',
    props => {
        if (props.tabStoreData.isChanged) {
            return createTargetPageChangedView(props);
        }

        return (
            <>
                <ScanIncompleteWarning
                    deps={props.deps}
                    warnings={props.scanIncompleteWarnings}
                    warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                    test={props.selectedTest}
                />
                <DetailsListIssuesView {...props} />
            </>
        );
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
            featureFlagStoreData={props.featureFlagStoreData}
        />
    );
}
