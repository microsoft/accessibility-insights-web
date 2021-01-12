// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import {
    AndroidScanResults,
    RuleResultsData,
} from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { convertScanResultsToUnifiedResults } from 'electron/platform/android/scan-results-to-unified-results';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import {
    buildRuleInformation,
    buildRuleResultObject,
    buildScanResultsObject,
    buildViewElement,
} from './scan-results-helpers';

describe('ScanResultsToUnifiedResults', () => {
    let generateGuidMock: IMock<() => string>;
    let ruleInformationProviderMock: IMock<RuleInformationProviderType>;

    const ruleId1: string = 'My Rule #1';
    const ruleId2: string = 'My Rule #2';
    const ruleId3: string = 'My Rule #3';
    const ruleId4: string = 'My Rule #4';

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);

        const ruleInformation1: RuleInformation = buildRuleInformation(ruleId1);
        const ruleInformation2: RuleInformation = buildRuleInformation(ruleId2);
        const ruleInformation3: RuleInformation = buildRuleInformation(ruleId3);
        const ruleInformation4: RuleInformation = buildRuleInformation(ruleId4, 'rule-link-4', []);

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
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId4))
            .returns(() => ruleInformation4);
    });

    function verifyMockCounts(
        expectedRule1Count: number,
        expectedRule2Count: number,
        expectedRule3Count: number,
        expectedRule4Count: number,
        expectedOtherCount: number,
    ): void {
        const totalCalls: number =
            expectedRule1Count +
            expectedRule2Count +
            expectedRule3Count +
            expectedRule4Count +
            expectedOtherCount;

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
            x => x.getRuleInformation(ruleId4),
            Times.exactly(expectedRule4Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(It.isAnyString()),
            Times.exactly(totalCalls),
        );
    }

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(
            null,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0, 0);
    });

    test('ScanResults with no RuleResults returns empty output', () => {
        const scanResults: AndroidScanResults = buildScanResultsObject();
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0, 0);
    });

    test('ScanResults with passes, failures, view IDs, and excluded results', () => {
        const id1: string = 'id1';
        const id2: string = 'id2';
        const id3: string = 'id3';
        const id4: string = 'id4';
        const ruleResults: RuleResultsData[] = [
            buildRuleResultObject(ruleId1, 'FAIL', id1),
            buildRuleResultObject('unsupported Rule #1', 'PASS', id2),
            buildRuleResultObject(ruleId2, 'FAIL', id3),
            buildRuleResultObject(ruleId2, 'PASS', id4),
            buildRuleResultObject('unsupported Rule #2', 'FAIL', id1),
            buildRuleResultObject(ruleId4, 'PASS', id2),
            buildRuleResultObject(ruleId3, 'PASS', id2),
            buildRuleResultObject(ruleId2, 'UNKNOWN', 'does not exist'), // Force "unknown" cases
        ];

        const viewElementTree = buildViewElement(
            id1,
            { top: 0, left: 10, bottom: 800, right: 600 },
            'myClass1',
            'myDescription1',
            'myText1',
            [
                buildViewElement(
                    id2,
                    { top: 10, left: 20, right: 35, bottom: 50 },
                    'myClass2',
                    null,
                    null,
                    [buildViewElement(id3, null, 'myClass3', null, null, null)],
                ),
                buildViewElement(
                    id4,
                    { top: 50, left: 10, right: 500, bottom: 300 },
                    'myClass4',
                    'myDescription4',
                    'myText4',
                    null,
                ),
            ],
        );

        const scanResults: AndroidScanResults = buildScanResultsObject(
            'Some device',
            'Some app',
            ruleResults,
            viewElementTree,
        );
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 3, 1, 1, 2);
    });
});
