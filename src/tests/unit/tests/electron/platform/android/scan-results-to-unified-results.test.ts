// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, Mock, MockBehavior } from 'typemoq';

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { RuleResultsData, ScanResults } from 'electron/platform/android/scan-results';
import { convertScanResultsToUnifiedResults } from 'electron/platform/android/scan-results-to-unified-results';
import {
    buildColorContrastRuleResultObject,
    buildRuleResultObject,
    buildScanResultsObject,
    buildTouchSizeWcagRuleResultObject,
    buildViewElement,
} from './scan-results-helpers';

describe('ScanResultsToUnifiedResults', () => {
    let generateGuidMock: IMock<() => string>;

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);
    });

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(null, null);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with no RuleResults returns empty output', () => {
        const scanResults: ScanResults = buildScanResultsObject();
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(scanResults, null);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with passes, failures, view IDs, and excluded results', () => {
        const id1: string = 'id1';
        const id2: string = 'id2';
        const id3: string = 'id3';
        const id4: string = 'id4';
        const ruleResults: RuleResultsData[] = [
            buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff', id1),
            buildRuleResultObject('unsupprted Rule #1', 'PASS', id2),
            buildTouchSizeWcagRuleResultObject('FAIL', 1.5, 48, 48, id3),
            buildTouchSizeWcagRuleResultObject('PASS', 1.0, 48, 48, id4),
            buildRuleResultObject('unsupprted Rule #2', 'FAIL', id1),
            buildColorContrastRuleResultObject('PASS', 21.0, 'ffffffff', 'ff000000', id2),
            buildTouchSizeWcagRuleResultObject('UNKNOWN', 1.0, 0, 0, 'does not exist'), // Force "unknown" cases
        ];

        const viewElementTree = buildViewElement(
            id1,
            { top: 0, left: 10, bottom: 800, right: 600 },
            'myClass1',
            'myDescription1',
            'myText1',
            [
                buildViewElement(id2, { top: 10, left: 20, right: 35, bottom: 50 }, 'myClass2', null, null, [
                    buildViewElement(id3, null, 'myClass3', null, null, null),
                ]),
                buildViewElement(id4, { top: 50, left: 10, right: 500, bottom: 300 }, 'myClass4', 'myDescription4', 'myText4', null),
            ],
        );

        const scanResults: ScanResults = buildScanResultsObject('Some device', 'Some app', ruleResults, viewElementTree);
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });
});
