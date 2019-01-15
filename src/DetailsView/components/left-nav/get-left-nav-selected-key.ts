// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../../../common/types/visualization-type';

export type GetLeftNavSelectedKeyProps = {
    type: VisualizationType,
};

export function getOverviewKey(): string {
    return 'Overview';
}

export function getTestViewKey(props: GetLeftNavSelectedKeyProps): string {
    return VisualizationType[props.type];
}
