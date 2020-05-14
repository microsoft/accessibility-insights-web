// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GettingStarted, RequirementName } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';

export type GetLeftNavSelectedKeyProps = {
    visualizationType: VisualizationType;
    selectedSubview: RequirementName | GettingStarted;
};

export function getOverviewKey(): string {
    return 'Overview';
}

export function getTestViewKey(props: GetLeftNavSelectedKeyProps): string {
    return VisualizationType[props.visualizationType];
}

export function getRequirementViewKey(props: GetLeftNavSelectedKeyProps): string {
    return props.selectedSubview;
}

export function getGettingStartedViewKey(props: GetLeftNavSelectedKeyProps): string {
    const testName = VisualizationType[props.visualizationType];
    const subview = props.selectedSubview;
    return `${testName}: ${subview}`;
}
