// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    InjectingState,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { getNumericVisualizationTypeValues } from 'common/visualization-type-helper';
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
            quickAssess: {},
        };

        if (this.visualizationConfigurationFactory != null) {
            getNumericVisualizationTypeValues().forEach((testNumber: number) => {
                const test = testNumber as VisualizationType;
                const config = this.visualizationConfigurationFactory.getConfiguration(test);
                defaultTests[config.testMode][config.key] = {
                    enabled: false,
                };
            });

            Object.keys(defaultTests.assessments).forEach(key => {
                defaultTests.assessments[key].stepStatus = {};
            });

            Object.keys(defaultTests.quickAssess).forEach(key => {
                defaultTests.quickAssess[key].stepStatus = {};
            });
        }

        this.updateInjectionState(persistedData);

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
            ? merge({}, defaultValues, persistedData, {
                  tests: { adhoc: defaultValues.tests.adhoc },
              })
            : defaultValues;
        return initialState;
    }

    private updateInjectionState(data: VisualizationStoreData): void {
        if (!data || data.injectingState !== undefined) {
            // Preserve any existing injection state
            return;
        }

        if (data['injectingStarted']) {
            data.injectingState = InjectingState.injectingStarted;
        } else {
            data.injectingState = data['injectingRequested']
                ? InjectingState.injectingRequested
                : InjectingState.notInjecting;
        }
        delete data['injectingRequested'];
        delete data['injectingStarted'];
    }
}
