// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { DetailsViewPivotType } from '../types/details-view-pivot-type';
import { VisualizationType } from '../types/visualization-type';
import { IBaseStore } from './../istore.d';
import { IDetailsViewContainerState } from '../../DetailsView/details-view-container';

export interface IPivotConfiguration {
    tests?: VisualizationType[];
    getSelectedDetailsView: (data: Partial<IDetailsViewContainerState>) => VisualizationType;
}

export class PivotConfiguration {
    private featureFlagStore: IBaseStore<IDictionaryStringTo<boolean>>;

    private readonly pivotConfigs: IDictionaryNumberTo<IPivotConfiguration> = {
        [DetailsViewPivotType.allTest]: {
            tests: [
                VisualizationType.Issues,
                VisualizationType.Landmarks,
                VisualizationType.Headings,
                VisualizationType.TabStops,
                VisualizationType.Color,
            ],
            getSelectedDetailsView: data => data.visualizationStoreData.selectedAdhocDetailsView,
        },
        [DetailsViewPivotType.fastPass]: {
            tests: [
                VisualizationType.Issues,
                VisualizationType.TabStops,
            ],
            getSelectedDetailsView: data => data.visualizationStoreData.selectedFastPassDetailsView,
        },
        [DetailsViewPivotType.assessment]: {
            getSelectedDetailsView: data => data.assessmentStoreData.assessmentNavState.selectedTestType,
        },
    };

    // use this dictionary to store any feature flag that enable/disable a visualization
    private readonly visualizationBehindFeatureFlagMap: IDictionaryNumberTo<string> = {
    };

    constructor(featureFlagStore: IBaseStore<IDictionaryStringTo<boolean>>) {
        this.featureFlagStore = featureFlagStore;
    }

    public getTestsByType(type: DetailsViewPivotType): VisualizationType[] {
        const config = this.getConfigByType(type);

        if (config == null || config.tests == null) {
            return null;
        }

        const tests = config.tests;

        const result = _.filter(tests, visualization => {
            const featureFlagName = this.visualizationBehindFeatureFlagMap[visualization];
            if (featureFlagName == null) {
                return true;
            }

            return this.featureFlagStore.getState()[featureFlagName];
        });

        return result;
    }

    public getConfigByType(type: DetailsViewPivotType): IPivotConfiguration {
        return this.pivotConfigs[type];
    }
}
