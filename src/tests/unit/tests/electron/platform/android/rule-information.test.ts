// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResolution } from 'common/types/store-data/unified-data-interface';
import { GetUnifiedResolutionDelegate, RuleInformation } from 'electron/platform/android/rule-information';
import { RuleResultsData } from 'electron/platform/android/scan-results';
import { Mock } from 'typemoq';

describe('RuleInformation', () => {
    const testInputs = ['abc', 'xyz', 'this should work'];

    test('RuleId works correctly', () => {
        for (const ruleId of testInputs) {
            const ruleInformation = new RuleInformation(ruleId, null, null);
            expect(ruleId === ruleInformation.ruleId);
        }
    });

    test('RuleDescription works correctly', () => {
        for (const ruleDescription of testInputs) {
            const ruleInformation = new RuleInformation(null, ruleDescription, null);
            expect(ruleDescription === ruleInformation.ruleDescription);
        }
    });

    test('GetUnifiedResolution works correctly', () => {
        const testData: RuleResultsData = {
            axeViewId: 'test',
            ruleId: 'some rule',
            status: 'pass',
            props: null,
        };

        for (const howToFixString of testInputs) {
            const expectedUnifiedResolution: UnifiedResolution = { howToFixSummary: howToFixString };

            const getUnifiedResolutionDelegateMock = Mock.ofType<GetUnifiedResolutionDelegate>();
            getUnifiedResolutionDelegateMock.setup(func => func(testData)).returns(() => expectedUnifiedResolution);

            const ruleInformation = new RuleInformation(null, null, getUnifiedResolutionDelegateMock.object);

            const actualUnifiedResolution = ruleInformation.getUnifiedResolution(testData);

            expect(actualUnifiedResolution).toBe(expectedUnifiedResolution);
        }
    });
});
