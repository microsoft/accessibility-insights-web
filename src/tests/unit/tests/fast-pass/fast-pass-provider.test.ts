// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { FastPassProvider } from 'fast-pass/fast-pass-provider';
import { DictionaryStringTo } from 'types/common-types';

describe('FastPassProvider', () => {
    const stubVisualizationType1 = createStubVisualizationType('stub1');
    const stubVisualizationType2 = createStubVisualizationType('stub2');
    const stubVisualizationType3 = createStubVisualizationType('enabled');
    const stubVisualizationType4 = createStubVisualizationType('disabled');
    const stubFastPassVisualizations: VisualizationType[] = [
        stubVisualizationType1,
        stubVisualizationType2,
    ];
    const stubFastPassFeatureFlags: DictionaryStringTo<VisualizationType> = {
        ['enabled feature flag']: stubVisualizationType3,
        ['disabled feature flag']: stubVisualizationType4,
    };
    const stubFeatureFlagStoreData: FeatureFlagStoreData = {
        ['enabled feature flag']: true,
        ['disabled feature flag']: false,
    };
    let testSubject: FastPassProvider;

    beforeEach(() => {
        testSubject = new FastPassProvider(
            stubFastPassVisualizations,
            stubFastPassFeatureFlags,
            stubFeatureFlagStoreData,
        );
    });

    it('getAllFastPassVisualizations returns a list of all FastPass visualization types, excluding those with disabled feature flags', () => {
        const expectedVisualizations: VisualizationType[] = [
            stubVisualizationType1,
            stubVisualizationType2,
            stubVisualizationType3,
        ];

        expect(testSubject.getAllFastPassVisualizations()).toEqual(expectedVisualizations);
    });

    it('getNumTests returns the total number of FastPass tests, excluding those with disabled feature flags', () => {
        expect(testSubject.getNumTests()).toEqual(3);
    });

    it('getStepIndexForType returns the step number corresponding to the visualization type', () => {
        expect(testSubject.getStepIndexForType(stubVisualizationType2)).toEqual(2);
        expect(testSubject.getStepIndexForType(stubVisualizationType4)).toEqual(0);
    });

    function createStubVisualizationType(name: string): VisualizationType {
        return (`${name} visualization type` as unknown) as VisualizationType;
    }
});
