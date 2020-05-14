// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autoPassIfNoResults } from 'assessments/auto-pass-if-no-results';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';

describe('autoPassIfNoResults', () => {
    it('returns PASS for instance data with a result', () => {
        const inputWithResult: InstanceIdToInstanceDataMap = {
            '#some-element': {
                target: ['#some-element'],
                html: '<div id="some-element" />',
                propertyBag: {
                    someDataProperty: 'some data',
                },
                testStepResults: {
                    'test-step-1': {
                        someResultData: 'some result data',
                    },
                },
            },
        };

        expect(autoPassIfNoResults(inputWithResult)).toBe(ManualTestStatus.PASS);
    });

    it('returns UNKNOWN for instance data with no results', () => {
        const inputWithNoResults: InstanceIdToInstanceDataMap = {};

        expect(autoPassIfNoResults(inputWithNoResults)).toBe(ManualTestStatus.UNKNOWN);
    });
});
