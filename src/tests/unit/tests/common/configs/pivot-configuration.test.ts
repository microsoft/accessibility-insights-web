// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { FeatureFlagStore } from '../../../../../background/stores/global/feature-flag-store';
import { PivotConfiguration } from '../../../../../common/configs/pivot-configuration';
import { getDefaultFeatureFlagValues } from '../../../../../common/feature-flags';
import { IBaseStore } from '../../../../../common/istore';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('PivotConfigurationTest', () => {
    let featureFlagsStoreMock: IMock<IBaseStore<IDictionaryStringTo<boolean>>>;

    beforeEach(() => {
        featureFlagsStoreMock = Mock.ofType(FeatureFlagStore, MockBehavior.Strict);
    });

    test('get config for unsupported type', () => {
        const testObject = new PivotConfiguration(featureFlagsStoreMock.object);

        const type: DetailsViewPivotType = -100 as DetailsViewPivotType;

        const result = testObject.getTestsByType(type);

        expect(result).toBeNull();
    });

    test('get config for all test', () => {
        const testObject = new PivotConfiguration(featureFlagsStoreMock.object);

        const type = DetailsViewPivotType.allTest;

        const result = testObject.getTestsByType(type);

        const expected = [
            VisualizationType.Issues,
            VisualizationType.Landmarks,
            VisualizationType.Headings,
            VisualizationType.TabStops,
            VisualizationType.Color,
        ];

        expect(result).toEqual(expected);
    });

    test('get config for fast pass', () => {
        featureFlagsStoreMock
            .setup(store => store.getState())
            .returns(() => getDefaultFeatureFlagValues())
            .verifiable(Times.never());

        const testObject = new PivotConfiguration(featureFlagsStoreMock.object);

        const type = DetailsViewPivotType.fastPass;

        const result = testObject.getTestsByType(type);

        const expected = [
            VisualizationType.Issues,
            VisualizationType.TabStops,
        ];

        expect(result).toEqual(expected);
        featureFlagsStoreMock.verifyAll();
    });

    test('get config for assessment', () => {
        featureFlagsStoreMock
            .setup(store => store.getState())
            .returns(() => getDefaultFeatureFlagValues())
            .verifiable(Times.never());

        const testObject = new PivotConfiguration(featureFlagsStoreMock.object);

        const type = DetailsViewPivotType.assessment;

        const result = testObject.getTestsByType(type);

        expect(result).toBeNull();
        featureFlagsStoreMock.verifyAll();
    });
});
