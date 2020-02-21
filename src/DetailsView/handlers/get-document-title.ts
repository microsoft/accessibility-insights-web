// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../common/types/visualization-type';

export interface GetTestViewTitleProps {
    selectedDetailsView: VisualizationType;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
}

export function getTestViewTitle(props: GetTestViewTitleProps): string {
    const configuration = props.visualizationConfigurationFactory.getConfiguration(
        props.selectedDetailsView,
    );
    const displayableData = configuration.displayableData;

    return displayableData.title;
}

export function getOverviewTitle(): string {
    return 'Overview';
}
