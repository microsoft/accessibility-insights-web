// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { IVisualizationConfiguration, VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../../common/types/store-data/ivisualization-scan-result-data';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { ReportGenerator } from '../reports/report-generator';
import { IssuesTableHandler } from './issues-table-handler';
import { IssuesTable, IssuesTableDeps } from './issues-table';
import { TargetPageChangedView } from './target-page-changed-view';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';

export type AdhocIssuesTestViewDeps = IssuesTableDeps;

export interface IAdhocIssuesTestViewProps {
    deps: AdhocIssuesTestViewDeps;
    tabStoreData: ITabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: IVisualizationStoreData;
    issueTrackerPath: string;
    dropdownClickHandler: DropdownClickHandler;
    visualizationScanResultData: IVisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    issuesSelection: ISelection;
    reportGenerator: ReportGenerator;
    issuesTableHandler: IssuesTableHandler;
    configuration: IVisualizationConfiguration;
}

export const AdhocIssuesTestView = NamedSFC<IAdhocIssuesTestViewProps>('AdhocIssuesTestView', ({ children, ...props }) => {
    const type = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(type, !scanData.enabled);
    const isScanning: boolean = props.visualizationStoreData.scanning !== null;
    const scanResult = props.visualizationScanResultData.issues.scanResult;
    const displayableData = props.configuration.displayableData;
    const selectedIdToRuleResultMap = props.visualizationScanResultData.issues.selectedIdToRuleResultMap;
    const title = props.configuration.displayableData.title;

    if (props.tabStoreData.isChanged) {
        return <TargetPageChangedView displayableData={displayableData} type={type} toggleClickHandler={clickHandler} />;
    }

    return (
        <IssuesTable
            deps={props.deps}
            title={title}
            dropdownClickHandler={props.dropdownClickHandler}
            issuesTableHandler={props.issuesTableHandler}
            issueTrackerPath={props.issueTrackerPath}
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
        />
    );
});
