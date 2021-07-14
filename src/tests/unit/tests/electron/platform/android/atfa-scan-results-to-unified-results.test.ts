// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { AccessibilityHierarchyCheckResult } from 'electron/platform/android/atfa-data-types';
import { convertAtfaScanResultsToUnifiedResults } from 'electron/platform/android/atfa-scan-results-to-unified-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import {
    buildAtfaResult,
    buildRuleInformation,
    buildScanResultsObject,
} from './scan-results-helpers';

describe('AtfaScanResultsToUnifiedResults', () => {
    let generateGuidMock: IMock<() => string>;
    let ruleInformationProviderMock: IMock<RuleInformationProviderType>;

    const ruleId1: string = 'My Rule #1';
    const ruleId2: string = 'My Rule #2';
    const ruleId3: string = 'My Rule #3';

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);

        const ruleInformation1: RuleInformation = buildRuleInformation(ruleId1);
        const ruleInformation2: RuleInformation = buildRuleInformation(ruleId2);
        const ruleInformation3: RuleInformation = buildRuleInformation(ruleId3, 'rule-link-3', []);

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

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedResult[] = convertAtfaScanResultsToUnifiedResults(
            null,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0);
    });

    test('ScanResults with no RuleResults returns empty output', () => {
        const scanResults: AndroidScanResults = buildScanResultsObject({});
        const results: UnifiedResult[] = convertAtfaScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0);
    });

    test('ScanResults with contentDescription and text fields specified directly and via Span', () => {
        const accessibilityClassName: string = 'accessible name #1';
        const className: string = 'viewClass1';
        const checkClass = ruleId1;
        const type: string = 'ERROR';
        const contentDescription: string = 'contentDescription (direct)';
        const contentDescriptionViaSpan: string = 'contentDescription (via Span)';
        const text: string = 'text (direct)';
        const textViaSpan: string = 'text (via Span)';

        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                contentDescription,
            }),
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                contentDescriptionViaSpan,
            }),
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                text,
            }),
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                textViaSpan,
            }),
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                contentDescription,
                textViaSpan,
            }),
            buildAtfaResult({
                accessibilityClassName,
                className,
                checkClass,
                type,
                contentDescription,
                text,
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            {
                deviceName: 'Some device',
                appIdentifier: 'Some app',
            },
            ruleResults,
        );
        const results: UnifiedResult[] = convertAtfaScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(6, 0, 0, 0);
    });

    test('ScanResults with skipped, info, warnings, errors, view IDs, and excluded results', () => {
        const accessibilityClassName1: string = 'accessible name #1';
        const accessibilityClassName2: string = 'accessible name #2';
        const className1: string = 'viewClass1';
        const className2: string = 'viewClass2';
        const id1: string = 'id1';
        const id2: string = 'id2';
        const id3: string = 'id3';
        const id4: string = 'id4';
        const ruleResults: AccessibilityHierarchyCheckResult[] = [
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'ERROR',
                boundsInScreen: { top: 0, left: 100, right: 200, bottom: 300 },
                contentDescription: id1,
                text: id2,
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName1,
                className: className1,
                checkClass: ruleId1,
                type: 'WARNING',
                boundsInScreen: { top: 0, left: 100, right: 200, bottom: 300 },
                contentDescription: id1,
                text: id2,
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
                contentDescription: id3,
                text: id4,
            }),
            buildAtfaResult({
                accessibilityClassName: accessibilityClassName2,
                className: className2,
                checkClass: 'Unknown rule',
                type: 'ERROR',
            }),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            {
                deviceName: 'Some device',
                appIdentifier: 'Some app',
            },
            ruleResults,
        );
        const results: UnifiedResult[] = convertAtfaScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(2, 1, 0, 1);
    });
});
