// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { link } from 'content/link';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { AccessibilityHierarchyCheckResult } from 'electron/platform/android/atfa-data-types';
import { convertAtfaScanResultsToUnifiedRules } from 'electron/platform/android/atfa-scan-results-to-unified-rules';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import {
    buildAtfaResult,
    buildRuleInformation,
    buildScanResultsObject,
} from './scan-results-helpers';

describe('AftaScanResultsToUnifiedRules', () => {
    let ruleInformationProviderMock: IMock<RuleInformationProviderType>;

    let generateGuidMock: IMock<() => string>;
    const deviceName: string = 'Super-duper device';
    const appIdentifier: string = 'Spectacular app';

    function verifyMockCounts(
        expectedRule1Count: number,
        expectedRule2Count: number,
        expectedRule3Count: number,
        expectedOtherCount: number,
    ): void {
        const totalCalls: number =
            expectedRule1Count + expectedRule2Count + expectedRule3Count + expectedOtherCount;

        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId1),
            Times.exactly(expectedRule1Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId2),
            Times.exactly(expectedRule2Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId3),
            Times.exactly(expectedRule3Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(It.isAnyString()),
            Times.exactly(totalCalls),
        );
    }

    const ruleId1: string = 'Rule #1';
    const ruleId2: string = 'Rule #2';
    const ruleId3: string = 'Rule #3';

    const accessibilityClassName1: string = 'accessible name #1';
    const className1: string = 'viewClass1';

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);

        const ruleInformation1: RuleInformation = buildRuleInformation(ruleId1);
        const ruleInformation2: RuleInformation = buildRuleInformation(ruleId2);
        const ruleInformation3: RuleInformation = buildRuleInformation(ruleId3, 'rule-link-3', [
            link.WCAG_1_1_1,
        ]);

        ruleInformationProviderMock = Mock.ofType<RuleInformationProviderType>();
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId1))
            .returns(() => ruleInformation1);
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId2))
            .returns(() => ruleInformation2);
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId3))
            .returns(() => ruleInformation3);
    });

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            null,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0);
    });

    test('ScanResults with no CheckResults returns empty output', () => {
        const scanResults: AndroidScanResults = buildScanResultsObject({
            deviceName,
            appIdentifier,
        });
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0);
    });

    test('ScanResults with only unsupported rules', () => {
        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: 'unsupported 1',
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: 'unsupported 2',
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: 'unsupported 3',
                type: 'ERROR',
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            { deviceName, appIdentifier },
            ruleResults,
        );
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 3);
    });

    test('ScanResults with 1 supported rule', () => {
        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            { deviceName, appIdentifier },
            ruleResults,
        );
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 0, 0, 0);
    });

    test('ScanResults with 1 supported rule that repeats', () => {
        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            { deviceName, appIdentifier },
            ruleResults,
        );
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 0, 0, 0);
    });

    test('ScanResults with a mix of supported and unsupported rules, some repeating', () => {
        const accessibilityClassName2: string = 'accessible name #2';
        const className2: string = 'viewClass2';
        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'WARNING',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId3,
                type: 'INFO',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId3,
                type: 'NOT_RUN',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName2,
                className: className2,
                checkClass: ruleId2,
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName2,
                className: className2,
                checkClass: 'Unknown rule #1',
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName2,
                className: className2,
                checkClass: 'Unknown rule #2',
                type: 'ERROR',
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName2,
                className: className2,
                checkClass: 'Unknown rule #3',
                type: 'ERROR',
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            { deviceName, appIdentifier },
            ruleResults,
        );
        const results: UnifiedRule[] = convertAtfaScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 1, 1, 3);
    });
});
