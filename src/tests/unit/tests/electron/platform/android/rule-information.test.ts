// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedFormattableResolution } from 'common/types/store-data/unified-data-interface';
import {
    GetUnifiedFormattableResolutionDelegate,
    IncludeThisResultDelegate,
    RuleInformation,
} from 'electron/platform/android/rule-information';
import { RuleResultsData } from 'electron/platform/android/android-scan-results';
import { Mock } from 'typemoq';

describe('RuleInformation', () => {
    const testInputs = ['abc', 'xyz', 'this should work'];

    function failIfCalled(ruleResultData: RuleResultsData): boolean {
        expect('method').toBe('should never be invoked');
        return false;
    }

    test('RuleId works correctly', () => {
        for (const ruleId of testInputs) {
            const ruleInformation = new RuleInformation(ruleId, null, null, failIfCalled);
            expect(ruleId === ruleInformation.ruleId);
        }
    });

    test('RuleDescription works correctly', () => {
        for (const ruleDescription of testInputs) {
            const ruleInformation = new RuleInformation(null, ruleDescription, null, failIfCalled);
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
            const expectedUnifiedFormattableResolution: UnifiedFormattableResolution = {
                howToFixSummary: howToFixString,
            };

            const getUnifiedFormattableResolutionDelegateMock = Mock.ofType<
                GetUnifiedFormattableResolutionDelegate
            >();
            getUnifiedFormattableResolutionDelegateMock
                .setup(func => func(testData))
                .returns(() => expectedUnifiedFormattableResolution);

            const ruleInformation = new RuleInformation(
                null,
                null,
                getUnifiedFormattableResolutionDelegateMock.object,
                failIfCalled,
            );

            const actualUnifiedResolution = ruleInformation.getUnifiedFormattableResolution(
                testData,
            );

            expect(actualUnifiedResolution).toBe(expectedUnifiedFormattableResolution);
        }
    });

    test('IncludeThisResult works correctly', () => {
        const expectedResults = [true, false];

        const testData: RuleResultsData = {
            axeViewId: 'test',
            ruleId: 'some rule',
            status: 'pass',
            props: null,
        };

        for (const expectedResult of expectedResults) {
            const includeThisResultMock = Mock.ofType<IncludeThisResultDelegate>();
            includeThisResultMock.setup(func => func(testData)).returns(() => expectedResult);

            const ruleInformation = new RuleInformation(
                null,
                null,
                null,
                includeThisResultMock.object,
            );

            const actualResult = ruleInformation.includeThisResult(testData);

            expect(actualResult).toBe(expectedResult);
        }
    });
});
