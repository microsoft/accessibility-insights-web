// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { ReportGeneratorV1 } from '../reports/report-generator';
import { IssuesTable, IssuesTableDeps } from './issues-table';
import { IssuesTableHandler } from './issues-table-handler';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocIssuesTestViewDeps = IssuesTableDeps;

export interface AdhocIssuesTestViewProps {
    deps: AdhocIssuesTestViewDeps;
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    issuesSelection: ISelection;
    reportGenerator: ReportGeneratorV1;
    issuesTableHandler: IssuesTableHandler;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export const AdhocIssuesTestView = NamedSFC<AdhocIssuesTestViewProps>('AdhocIssuesTestView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const isScanning: boolean = props.visualizationStoreData.scanning !== null;
    const scanResult = props.visualizationScanResultData.issues.scanResult;
    const displayableData = props.configuration.displayableData;
    const selectedIdToRuleResultMap = props.visualizationScanResultData.issues.selectedIdToRuleResultMap;
    const title = props.configuration.displayableData.title;
    const subtitle = props.configuration.displayableData.subtitle;

    if (props.tabStoreData.isChanged) {
        return (
            <TargetPageChangedView displayableData={displayableData} visualizationType={selectedTest} toggleClickHandler={clickHandler} />
        );
    }

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
            reportGenerator={props.reportGenerator}
            userConfigurationStoreData={props.userConfigurationStoreData}
        />
    );
});
