// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleInformation } from '../../../../../../electron/platform/android/rule-information';
import { RuleInformationProvider } from '../../../../../../electron/platform/android/rule-information-provider';
import { RuleResultsData } from '../../../../../../electron/platform/android/scan-results';
import { buildRuleResultObject } from './scan-results-helpers';

describe('RuleInformationProvider', () => {
    let provider: RuleInformationProvider;

    beforeAll(() => {
        provider = new RuleInformationProvider();
    });

    test('getRuleInformation returns null for an unknown ruleId', () => {
        expect(provider.getRuleInformation('unknown rule')).toBeNull();
    });

    function validateHowToFix(ruleId: string, ruleResult: RuleResultsData): string {
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleId);
        const howToFix = ruleInformation.howToFix(ruleResult);

        expect(ruleInformation).toBeTruthy();
        expect(ruleInformation.ruleId).toEqual(ruleId);
        expect(ruleInformation.ruleDescription.length).toBeGreaterThan(0);
        expect(howToFix.length).toBeGreaterThan(0);

        return howToFix;
    }

    test('getRuleInformation returns correct data for ColorContrast rule', () => {
        const testRuleId: string = 'ColorContrast';
        // This is built from an actual Android result
        const props = {};
        props['Color Contrast Ratio'] = 2.798498811425733;
        props['Foreground Color'] = 'ff979797';
        props['Background Color'] = 'fffafafa';
        const ruleResult = buildRuleResultObject(testRuleId, 'FAIL', props) as RuleResultsData;
        const howToFix: string = validateHowToFix(testRuleId, ruleResult);

        expect(howToFix.indexOf('contrast of 2.798498811425733.')).toBeGreaterThan(0);
        expect(howToFix.indexOf('Foreground color: #979797,')).toBeGreaterThan(0);
        expect(howToFix.indexOf('background color: #fafafa)')).toBeGreaterThan(0);
    });

    test('getRuleInformation returns correct data for TouchSizeWcag rule', () => {
        const testRuleId: string = 'TouchSizeWcag';
        const props = {};
        // This is built from an actual Android result
        props['Screen Dots Per Inch'] = 2.25;
        props['height'] = 86;
        props['width'] = 95;

        const ruleResult = buildRuleResultObject(testRuleId, 'FAIL', props) as RuleResultsData;
        const howToFix: string = validateHowToFix(testRuleId, ruleResult);

        expect(howToFix.indexOf('width: 42.22222222222222dp')).toBeGreaterThan(0);
        expect(howToFix.indexOf('height: 38.22222222222222dp')).toBeGreaterThan(0);
    });

    test('getRuleInformation returns correct data for ActiveViewName rule', () => {
        validateHowToFix('ActiveViewName', null);
    });

    test('getRuleInformation returns correct data for EditTextValue rule', () => {
        validateHowToFix('EditTextValue', null);
    });

    test('getRuleInformation returns correct data for ImageViewName rule', () => {
        validateHowToFix('ImageViewName', null);
    });
});
