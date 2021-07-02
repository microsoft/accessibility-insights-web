// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    UnifiedResolution,
} from 'common/types/store-data/unified-data-interface';
import { RuleResultsData } from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';

import { buildAxeRuleResultObject } from './scan-results-helpers';

describe('RuleInformationProvider', () => {
    let provider: RuleInformationProvider;

    beforeAll(() => {
        provider = new RuleInformationProvider();
    });

    function buildTouchSizeWcagRuleResultObject(
        status: string,
        dpi: number,
        height: number,
        width: number,
    ): RuleResultsData {
        const props = {};
        // This is based on the output of the Android service.
        props['Screen Dots Per Inch'] = dpi;

        const left: number = 123;
        const top: number = 345;
        const right = left + width;
        const bottom = top + height;

        props['boundsInScreen'] = {
            top: top,
            left: left,
            bottom: bottom,
            right: right,
        };

        return buildAxeRuleResultObject('TouchSizeWcag', status, null, props);
    }

    function buildColorContrastRuleResultObject(
        status: string,
        ratio: number,
        foreground: string,
        background: string,
        confidence: string,
    ): RuleResultsData {
        const props = {};
        // This is based on the output of the Android service
        if (ratio) {
            props['Color Contrast Ratio'] = ratio;
        }
        props['Foreground Color'] = foreground;
        props['Background Color'] = background;
        props['Confidence in Color Detection'] = confidence;

        return buildAxeRuleResultObject('ColorContrast', status, null, props);
    }

    test('getRuleInformation returns null for an unknown ruleId', () => {
        expect(provider.getRuleInformation('unknown rule')).toBeNull();
    });

    test.each([
        'ActiveViewName',
        'ClassNameCheck',
        'ClickableSpanCheck',
        'DuplicateClickableBoundsCheck',
        'DuplicateSpeakableTextCheck',
        'EditTextValue',
        'ImageContrastCheck',
        'ImageViewName',
        'LinkPurposeUnclearCheck',
        'RedundantDescriptionCheck',
        'TextContrastCheck',
        'TraversalOrderCheck',
    ])('getRuleInformation returns correct data for %s rule', (ruleId: string) => {
        const unifiedResolution = validateUnifiedResolution(ruleId, null);
        expect(unifiedResolution).toMatchSnapshot();
    });

    function validateUnifiedResolution(
        ruleId: string,
        ruleResult: RuleResultsData,
    ): UnifiedResolution {
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleId);
        const unifiedResolution = ruleInformation.getUnifiedResolution(ruleResult);

        expect(ruleInformation).toBeTruthy();
        expect(ruleInformation.ruleId).toEqual(ruleId);
        expect(ruleInformation.ruleDescription.length).toBeGreaterThan(0);

        return unifiedResolution;
    }

    test('getRuleInformation returns correct data for ColorContrast rule', () => {
        const testRuleId: string = 'ColorContrast';
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            2.798498811425733,
            'ff979797',
            'fffafafa',
            'High',
        );
        const unifiedResolution = validateUnifiedResolution(testRuleId, ruleResult);
        expect(unifiedResolution).toMatchSnapshot();
    });

    test('getRuleInformation handles no foreground/background color values', () => {
        const testRuleId: string = 'ColorContrast';
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            null,
            null,
            null,
            'None',
        );
        const unifiedResolution = validateUnifiedResolution(testRuleId, ruleResult);
        expect(unifiedResolution).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for TouchSizeWcag rule', () => {
        const testRuleId: string = 'TouchSizeWcag';
        const ruleResult: RuleResultsData = buildTouchSizeWcagRuleResultObject(
            'FAIL',
            2.25,
            86,
            95,
        );
        const unifiedResolution = validateUnifiedResolution(testRuleId, ruleResult);
        expect(unifiedResolution).toMatchSnapshot();
    });

    test('ColorContrast getResultStatus returns unknown when confidence is defined and High', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            2.798498811425733,
            'ff979797',
            'fffafafa',
            'High',
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.getResultStatus(ruleResult)).toBe('unknown');
    });

    test('ColorContrast getResultStatus returns pass when confidence is defined but not High', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            2.798498811425733,
            'ff979797',
            'fffafafa',
            'Medium',
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.getResultStatus(ruleResult)).toBe('pass');
    });

    test('ColorContrast getResultStatus returns pass when confidence is not defined', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'PASS',
            null,
            null,
            null,
            null,
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.getResultStatus(ruleResult)).toBe('pass');
    });

    test('TouchSizeWcag getResultStatus returns fail', () => {
        const ruleResult: RuleResultsData = buildTouchSizeWcagRuleResultObject(
            'FAIL',
            2.25,
            86,
            95,
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.getResultStatus(ruleResult)).toBe('fail');
    });

    type ruleStatusTestCase = {
        ruleId: string;
        status: string;
        outcome: InstanceResultStatus;
    };

    const ruleIdsToTest: ruleStatusTestCase[] = [
        {
            ruleId: 'ActiveViewName',
            status: 'PASS',
            outcome: 'pass',
        },
        {
            ruleId: 'ActiveViewName',
            status: 'FAIL',
            outcome: 'fail',
        },
        {
            ruleId: 'EditTextValue',
            status: 'PASS',
            outcome: 'pass',
        },
        {
            ruleId: 'EditTextValue',
            status: 'FAIL',
            outcome: 'fail',
        },
        {
            ruleId: 'ImageViewName',
            status: 'PASS',
            outcome: 'pass',
        },
        {
            ruleId: 'ImageViewName',
            status: 'FAIL',
            outcome: 'fail',
        },
        {
            ruleId: 'ClassNameCheck',
            status: 'ERROR',
            outcome: 'unknown',
        },
        {
            ruleId: 'ClassNameCheck',
            status: 'WARNING',
            outcome: 'unknown',
        },
        {
            ruleId: 'ClassNameCheck',
            status: 'INFO',
            outcome: 'pass',
        },
        {
            ruleId: 'ClassNameCheck',
            status: 'NOT_RUN',
            outcome: 'pass',
        },
    ];

    test.each(ruleIdsToTest)(
        'getResultStatus evaulates properly for %s',
        (testCase: ruleStatusTestCase) => {
            const ruleResult = buildAxeRuleResultObject(testCase.ruleId, testCase.status);
            const ruleInformation: RuleInformation = provider.getRuleInformation(testCase.ruleId);
            expect(ruleInformation.getResultStatus(ruleResult)).toBe(testCase.outcome);
        },
    );
});
