// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, Mock, MockBehavior } from 'typemoq';

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { RuleResultsData, ScanResults } from '../../../../../../electron/platform/android/scan-results';
import { convertScanResultsToUnifiedResults } from '../../../../../../electron/platform/android/scan-results-to-unified-results';
import {
    buildColorContastRuleResultObject,
    buildRuleResultObject,
    buildScanResultsObject,
    buildTouchSizeWcagRuleResultObject,
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

    test('ScanResults with passes, failures, and excluded results', () => {
        const ruleResults: RuleResultsData[] = [
            buildColorContastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff'),
            buildRuleResultObject('unsupprted Rule #1', 'PASS'),
            buildTouchSizeWcagRuleResultObject('FAIL', 1.5, 48, 48),
            buildTouchSizeWcagRuleResultObject('PASS', 1.0, 48, 48),
            buildRuleResultObject('unsupprted Rule #2', 'FAIL'),
            buildColorContastRuleResultObject('PASS', 21.0, 'ffffffff', 'ff000000'),
            buildTouchSizeWcagRuleResultObject('UNKNOWN', 1.0, 0, 0), // Force "unknown" case
        ];

        const scanResults: ScanResults = buildScanResultsObject('Some device', 'Some app', ruleResults);
        const results: UnifiedResult[] = convertScanResultsToUnifiedResults(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });
});
