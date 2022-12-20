// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { EnumHelper } from 'common/enum-helper';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    InjectingState,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { isEmpty, merge } from 'lodash';

export class InitialVisualizationStoreDataGenerator {
    constructor(
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {}

    public generateInitialState(
        persistedData: VisualizationStoreData = null,
    ): VisualizationStoreData {
        const defaultTests: TestsEnabledState = {
            adhoc: {},
            assessments: {},
            mediumPass: {},
        };

        if (this.visualizationConfigurationFactory != null) {
            EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
                const config = this.visualizationConfigurationFactory.getConfiguration(test);
                defaultTests[config.testMode][config.key] = {
                    enabled: false,
                };
            });

            Object.keys(defaultTests.assessments).forEach(key => {
                defaultTests.assessments[key].stepStatus = {};
            });

            Object.keys(defaultTests.mediumPass).forEach(key => {
                defaultTests.mediumPass[key].stepStatus = {};
            });
        }
        const defaultValues: VisualizationStoreData = {
            tests: defaultTests,
            scanning: null,
            selectedFastPassDetailsView: VisualizationType.Issues,
            selectedAdhocDetailsView: VisualizationType.Issues,
            selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
            injectingState: InjectingState.notInjecting,
            focusedTarget: null,
        };
        const initialState = !isEmpty(persistedData)
            ? merge({}, defaultValues, persistedData)
            : defaultValues;

        return initialState;
    }
}
