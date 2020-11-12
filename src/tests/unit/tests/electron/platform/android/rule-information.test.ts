// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    UnifiedResolution,
} from 'common/types/store-data/unified-data-interface';
import { link } from 'content/link';
import { RuleResultsData } from 'electron/platform/android/android-scan-results';
import {
    GetUnifiedResolutionDelegate,
    GetResultStatusDelegate,
    RuleInformation,
} from 'electron/platform/android/rule-information';
import { Mock } from 'typemoq';

describe('RuleInformation', () => {
    const testInputs = ['abc', 'xyz', 'this should work'];

    function failIfCalled(ruleResultData: RuleResultsData): InstanceResultStatus {
        expect('method').toBe('should never be invoked');
        return 'fail';
    }

    test('RuleId works correctly', () => {
        for (const ruleId of testInputs) {
            const ruleInformation = new RuleInformation(
                ruleId,
                null,
                null,
                null,
                null,
                failIfCalled,
            );
            expect(ruleId === ruleInformation.ruleId);
        }
    });

    test('RuleDescription works correctly', () => {
        for (const ruleDescription of testInputs) {
            const ruleInformation = new RuleInformation(
                null,
                null,
                ruleDescription,
                null,
                null,
                failIfCalled,
            );
            expect(ruleDescription === ruleInformation.ruleDescription);
        }
    });

    test('rule link works correctly', () => {
        const guidance = [link.WCAG_1_1_1];
        const ruleInformation = new RuleInformation(null, null, null, guidance, null, failIfCalled);
        expect(ruleInformation.guidance).toEqual(guidance);
    });

    test('guidance works correctly', () => {
        const url = 'rule-link';
        const ruleInformation = new RuleInformation(
            null,
            'rule-link',
            null,
            null,
            null,
            failIfCalled,
        );
        expect(ruleInformation.ruleLink).toEqual(url);
    });

    test('GetUnifiedResolution works correctly', () => {
        const testData: RuleResultsData = {
            axeViewId: 'test',
            ruleId: 'some rule',
            status: 'pass',
            props: null,
        };

        for (const howToFixString of testInputs) {
            const expectedUnifiedResolution: UnifiedResolution = {
                howToFixSummary: howToFixString,
            };

            const getUnifiedResolutionDelegateMock = Mock.ofType<GetUnifiedResolutionDelegate>();
            getUnifiedResolutionDelegateMock
                .setup(func => func(testData))
                .returns(() => expectedUnifiedResolution);

            const ruleInformation = new RuleInformation(
                null,
                null,
                null,
                null,
                getUnifiedResolutionDelegateMock.object,
                failIfCalled,
            );

            const actualUnifiedResolution = ruleInformation.getUnifiedResolution(testData);

            expect(actualUnifiedResolution).toBe(expectedUnifiedResolution);
        }
    });

    test('GetResultStatus works correctly', () => {
        const expectedResults: InstanceResultStatus[] = ['pass', 'fail', 'unknown'];

        const testData: RuleResultsData = {
            axeViewId: 'test',
            ruleId: 'some rule',
            status: 'pass',
            props: null,
        };

        for (const expectedResult of expectedResults) {
            const includeThisResultMock = Mock.ofType<GetResultStatusDelegate>();
            includeThisResultMock.setup(func => func(testData)).returns(() => expectedResult);

            const ruleInformation = new RuleInformation(
                null,
                null,
                null,
                null,
                null,
                includeThisResultMock.object,
            );

            const actualResult = ruleInformation.getResultStatus(testData);

            expect(actualResult).toBe(expectedResult);
        }
    });
});
