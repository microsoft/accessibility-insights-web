// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleInformation } from '../../../../../../electron/platform/android/rule-information';

describe('RuleInformation', () => {
    test('RuleId works correctly', () => {
        const ruleIds = ['abc', 'xyz', 'this should work'];
        for (const ruleId of ruleIds) {
            const ruleInformation = new RuleInformation(ruleId, 'b', () => 'c');
            expect(ruleId === ruleInformation.ruleId);
        }
    });

    test('RuleDescription works correctly', () => {
        const ruleDescriptions = ['abc', 'xyz', 'this should work'];
        for (const ruleDescription of ruleDescriptions) {
            const ruleInformation = new RuleInformation('a', ruleDescription, () => 'c');
            expect(ruleDescription === ruleInformation.ruleDescription);
        }
    });

    test('HowToFix works correctly', () => {
        const howToFixStrings = ['abc', 'xyz', 'this should work'];
        for (const howToFixString of howToFixStrings) {
            const ruleInformation = new RuleInformation('a', 'b', () => howToFixString);
            expect(howToFixString === ruleInformation.howToFix(null));
        }
    });
});
