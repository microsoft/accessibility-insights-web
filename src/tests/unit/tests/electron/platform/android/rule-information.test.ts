// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleInformation } from '../../../../../../electron/platform/android/rule-information';

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

    test('HowToFix works correctly', () => {
        for (const howToFixString of testInputs) {
            const ruleInformation = new RuleInformation(null, null, () => howToFixString);
            expect(howToFixString === ruleInformation.howToFix(null));
        }
    });
});
