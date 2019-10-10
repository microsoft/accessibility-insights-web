// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { UnifiedStatusResults } from '../../common/components/cards/failed-instances-section';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { TargetAppData } from '../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { IssuesTable, IssuesTableDeps } from './issues-table';
import { IssuesTableHandler } from './issues-table-handler';

export type DetailsListIssuesViewDeps = IssuesTableDeps;

export interface DetailsListIssuesViewProps {
    deps: DetailsListIssuesViewDeps;
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    issuesSelection: ISelection;
    issuesTableHandler: IssuesTableHandler;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    ruleResultsByStatus: UnifiedStatusResults;
    targetAppInfo: TargetAppData;
    cardSelectionStoreData: CardSelectionStoreData;
}

export const DetailsListIssuesView = NamedFC<DetailsListIssuesViewProps>('DetailsListIssuesView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const isScanning: boolean = props.visualizationStoreData.scanning !== null;
    const scanResult = props.visualizationScanResultData.issues.scanResult;
    const selectedIdToRuleResultMap = props.visualizationScanResultData.issues.selectedIdToRuleResultMap;
    const title = props.configuration.displayableData.title;
    const subtitle = props.configuration.displayableData.subtitle;

    return (
        <IssuesTable
            deps={props.deps}
            title={title}
            subtitle={subtitle}
            issuesTableHandler={props.issuesTableHandler}
            issuesEnabled={scanData.enabled}
            violations={scanResult != null ? scanResult.violations : null}
            issuesSelection={props.issuesSelection}
            selectedIdToRuleResultMap={selectedIdToRuleResultMap}
            pageTitle={props.tabStoreData.title}
            pageUrl={props.tabStoreData.url}
            scanning={isScanning}
            toggleClickHandler={clickHandler}
            visualizationConfigurationFactory={props.visualizationConfigurationFactory}
            featureFlags={props.featureFlagStoreData}
            scanResult={scanResult}
            userConfigurationStoreData={props.userConfigurationStoreData}
            ruleResultsByStatus={props.ruleResultsByStatus}
            targetAppInfo={props.targetAppInfo}
            cardSelectionStoreData={props.cardSelectionStoreData}
        />
    );
});
