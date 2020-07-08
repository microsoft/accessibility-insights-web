// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationToggleProps } from '../../../common/components/visualization-toggle';
import { BaseDataBuilder } from './base-data-builder';

export class VisualizationTogglePropsBuilder extends BaseDataBuilder<VisualizationToggleProps> {
    constructor() {
        super();
        this.data = {
            checked: false,
            disabled: false,
            visualizationName: 'stub visualization name',
        } as VisualizationToggleProps;
    }
}
