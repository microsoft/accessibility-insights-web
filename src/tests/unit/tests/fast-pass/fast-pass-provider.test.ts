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
    const stubFastPassFeatureFlagsToVisualizationTypes: DictionaryStringTo<VisualizationType> = {
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
            stubFastPassFeatureFlagsToVisualizationTypes,
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

    describe('getStepsText', () => {
        it('returns expected message for existing visualization', () => {
            expect(testSubject.getStepsText(stubVisualizationType1)).toBe('Step 1 of 3');
            expect(testSubject.getStepsText(stubVisualizationType2)).toBe('Step 2 of 3');
        });

        it('returns expected message for visualization with enabled feature flag', () => {
            expect(testSubject.getStepsText(stubVisualizationType3)).toBe('Step 3 of 3');
        });

        it('returns expected message for visualization with disabled feature flag', () => {
            expect(testSubject.getStepsText(stubVisualizationType4)).toBe('Step 0 of 3');
        });
    });

    function createStubVisualizationType(name: string): VisualizationType {
        return `${name} visualization type` as unknown as VisualizationType;
    }
});
