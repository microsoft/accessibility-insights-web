// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedFormattableResolution } from 'common/types/store-data/unified-data-interface';
import { RuleResultsData } from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { buildRuleResultObject } from './scan-results-helpers';

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

        return buildRuleResultObject('TouchSizeWcag', status, null, props);
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

        return buildRuleResultObject('ColorContrast', status, null, props);
    }

    test('getRuleInformation returns null for an unknown ruleId', () => {
        expect(provider.getRuleInformation('unknown rule')).toBeNull();
    });

    function validateUnifiedFormattableResolution(
        ruleId: string,
        ruleResult: RuleResultsData,
    ): UnifiedFormattableResolution {
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleId);
        const unifiedResolution = ruleInformation.getUnifiedFormattableResolution(ruleResult);

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
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            testRuleId,
            ruleResult,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
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
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            testRuleId,
            ruleResult,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for TouchSizeWcag rule', () => {
        const testRuleId: string = 'TouchSizeWcag';
        const ruleResult: RuleResultsData = buildTouchSizeWcagRuleResultObject(
            'FAIL',
            2.25,
            86,
            95,
        );
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            testRuleId,
            ruleResult,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for ActiveViewName rule', () => {
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            'ActiveViewName',
            null,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for EditTextValue rule', () => {
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            'EditTextValue',
            null,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for ImageViewName rule', () => {
        const unifiedFormattableResolution = validateUnifiedFormattableResolution(
            'ImageViewName',
            null,
        );
        expect(unifiedFormattableResolution).toMatchSnapshot();
    });

    test('ColorContrast includeThisResult returns true when confidence is defined and High', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            2.798498811425733,
            'ff979797',
            'fffafafa',
            'High',
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.includeThisResult(ruleResult)).toBe(true);
    });

    test('ColorContrast includeThisResult returns false when confidence is defined but not High', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'FAIL',
            2.798498811425733,
            'ff979797',
            'fffafafa',
            'Medium',
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.includeThisResult(ruleResult)).toBe(false);
    });

    test('ColorContrast includeThisResult returns false when confidence is not defined', () => {
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject(
            'PASS',
            null,
            null,
            null,
            null,
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.includeThisResult(ruleResult)).toBe(false);
    });

    test('TouchSizeWcag includeThisResult returns true', () => {
        const ruleResult: RuleResultsData = buildTouchSizeWcagRuleResultObject(
            'FAIL',
            2.25,
            86,
            95,
        );
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleResult.ruleId);
        expect(ruleInformation.includeThisResult(null)).toBe(true);
    });

    test('ActiveViewName includeThisResult returns true', () => {
        const ruleInformation: RuleInformation = provider.getRuleInformation('ActiveViewName');
        expect(ruleInformation.includeThisResult(null)).toBe(true);
    });

    test('EditTextValue includeThisResult returns true', () => {
        const ruleInformation: RuleInformation = provider.getRuleInformation('EditTextValue');
        expect(ruleInformation.includeThisResult(null)).toBe(true);
    });

    test('ImageViewName includeThisResult returns true', () => {
        const ruleInformation: RuleInformation = provider.getRuleInformation('ImageViewName');
        expect(ruleInformation.includeThisResult(null)).toBe(true);
    });
});
