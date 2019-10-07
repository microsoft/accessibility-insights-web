// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Mock } from 'typemoq';

import { HowToFixDelegate, RuleInformation } from 'electron/platform/android/rule-information';
import { RuleResultsData } from 'electron/platform/android/scan-results';

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
        const testData: RuleResultsData = {
            axeViewId: 'test',
            ruleId: 'some rule',
            status: 'pass',
            props: null,
        };

        for (const howToFixString of testInputs) {
            const expectedPropertyBag = { someLabel: howToFixString };
            const howToFixDelegateMock = Mock.ofType<HowToFixDelegate>();
            howToFixDelegateMock.setup(func => func(testData)).returns(() => expectedPropertyBag);
            const ruleInformation = new RuleInformation(null, null, howToFixDelegateMock.object);
            const actualPropertyBag = ruleInformation.howToFix(testData);
            expect(actualPropertyBag).toBe(expectedPropertyBag);
        }
    });
});
