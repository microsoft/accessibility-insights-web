// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, Mock, MockBehavior } from 'typemoq';

import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { RuleResultsData, ScanResults } from 'electron/platform/android/scan-results';
import { convertScanResultsToUnifiedRules } from 'electron/platform/android/scan-results-to-unified-rules';
import {
    buildColorContrastRuleResultObject,
    buildRuleResultObject,
    buildScanResultsObject,
    buildTouchSizeWcagRuleResultObject,
} from './scan-results-helpers';

describe('ScanResultsToUnifiedResults', () => {
    let generateGuidMock: IMock<() => string>;
    const deviceName: string = 'Super-duper device';
    const appIdentifier: string = 'Spectacular app';

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);
    });

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(null, null);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with no RuleResults returns empty output', () => {
        const scanResults: ScanResults = buildScanResultsObject(deviceName, appIdentifier);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResults, null);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with only unsupported rules', () => {
        const ruleResults: RuleResultsData[] = [
            buildRuleResultObject('unsupported 1', 'PASS'),
            buildRuleResultObject('unsupported 2', 'FAIL'),
            buildRuleResultObject('unsupported 3', 'PASS'),
        ];

        const scanResults: ScanResults = buildScanResultsObject(deviceName, appIdentifier, ruleResults);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with 1 supported rule', () => {
        const ruleResults: RuleResultsData[] = [buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff')];

        const scanResults: ScanResults = buildScanResultsObject(deviceName, appIdentifier, ruleResults);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with 1 supported rule that repeats', () => {
        const ruleResults: RuleResultsData[] = [
            buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff'),
            buildColorContrastRuleResultObject('PASS', 1.0, 'ff000000', 'ffffffff'),
            buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff'),
        ];

        const scanResults: ScanResults = buildScanResultsObject(deviceName, appIdentifier, ruleResults);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });

    test('ScanResults with a mix of supported and unsupported rules', () => {
        const ruleResults: RuleResultsData[] = [
            buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff'),
            buildColorContrastRuleResultObject('PASS', 1.0, 'ff000000', 'ffffffff'),
            buildTouchSizeWcagRuleResultObject('PASS', 1.0, 50, 100),
            buildColorContrastRuleResultObject('FAIL', 1.0, 'ffffffff', 'ffffffff'),
            buildRuleResultObject('not supported', 'PASS'),
            buildRuleResultObject('ImageViewName', 'FAIL'),
            buildRuleResultObject('sorry', 'FAIL'),
            buildRuleResultObject('EditTextValue', 'PASS'),
            buildRuleResultObject('ActiveViewName', 'FAIL'),
            buildRuleResultObject('ActiveViewName', 'PASS'),
            buildTouchSizeWcagRuleResultObject('FAIL', 1.5, 50, 100),
            buildRuleResultObject('EditTextValue', 'PASS'),
        ];

        const scanResults: ScanResults = buildScanResultsObject(deviceName, appIdentifier, ruleResults);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResults, generateGuidMock.object);
        expect(results).toMatchSnapshot();
    });
});
