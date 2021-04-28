// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import * as React from 'react';
import { IssuesTable, IssuesTableDeps } from './issues-table';

export type DetailsListIssuesViewDeps = IssuesTableDeps;

export interface DetailsListIssuesViewProps {
    deps: DetailsListIssuesViewDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    visualizationStoreData: VisualizationStoreData;
    configuration: VisualizationConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    instancesSection: ReactFCWithDisplayName<CommonInstancesSectionProps>;
    selectedTest: VisualizationType;
}

export const DetailsListIssuesView = NamedFC<DetailsListIssuesViewProps>(
    'DetailsListIssuesView',
    ({ children, ...props }) => {
        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const isScanning: boolean = props.visualizationStoreData.scanning !== null;
        const title = props.configuration.displayableData.title;
        const subtitle = props.configuration.displayableData.subtitle;

        const stepsText = (): string => {
            const fastPassProvider = createFastPassProviderWithFeatureFlags(
                props.featureFlagStoreData,
            );
            return fastPassProvider.getStepsText(props.selectedTest);
        };

        return (
            <IssuesTable
                deps={props.deps}
                title={title}
                subtitle={subtitle}
                stepsText={stepsText()}
                issuesEnabled={scanData.enabled}
                scanning={isScanning}
                featureFlags={props.featureFlagStoreData}
                userConfigurationStoreData={props.userConfigurationStoreData}
                scanMetadata={props.scanMetadata}
                cardsViewData={props.cardsViewData}
                instancesSection={props.instancesSection}
                visualizationStoreData={props.visualizationStoreData}
            />
        );
    },
);
