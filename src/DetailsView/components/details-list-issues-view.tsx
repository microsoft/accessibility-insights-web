// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react';
import * as React from 'react';

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { CardsViewModel } from '../../common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
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
    featureFlagStoreData: FeatureFlagStoreData;
    visualizationStoreData: VisualizationStoreData;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
}

export const DetailsListIssuesView = NamedFC<DetailsListIssuesViewProps>(
    'DetailsListIssuesView',
    ({ children, ...props }) => {
        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const isScanning: boolean = props.visualizationStoreData.scanning !== null;
        const title = props.configuration.displayableData.title;
        const subtitle = props.configuration.displayableData.subtitle;

        return (
            <IssuesTable
                deps={props.deps}
                title={title}
                subtitle={subtitle}
                issuesEnabled={scanData.enabled}
                scanning={isScanning}
                featureFlags={props.featureFlagStoreData}
                userConfigurationStoreData={props.userConfigurationStoreData}
                scanMetadata={props.scanMetadata}
                cardsViewData={props.cardsViewData}
            />
        );
    },
);
