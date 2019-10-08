// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InstancePropertyBag } from 'common/types/store-data/unified-data-interface';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { RuleResultsData } from 'electron/platform/android/scan-results';
import { buildColorContrastRuleResultObject, buildTouchSizeWcagRuleResultObject } from './scan-results-helpers';

describe('RuleInformationProvider', () => {
    let provider: RuleInformationProvider;

    beforeAll(() => {
        provider = new RuleInformationProvider();
    });

    test('getRuleInformation returns null for an unknown ruleId', () => {
        expect(provider.getRuleInformation('unknown rule')).toBeNull();
    });

    function validateHowToFix(ruleId: string, ruleResult: RuleResultsData): InstancePropertyBag {
        const ruleInformation: RuleInformation = provider.getRuleInformation(ruleId);
        const howToFix = ruleInformation.howToFix(ruleResult);

        expect(ruleInformation).toBeTruthy();
        expect(ruleInformation.ruleId).toEqual(ruleId);
        expect(ruleInformation.ruleDescription.length).toBeGreaterThan(0);

        return howToFix;
    }

    test('getRuleInformation returns correct data for ColorContrast rule', () => {
        const testRuleId: string = 'ColorContrast';
        const ruleResult: RuleResultsData = buildColorContrastRuleResultObject('FAIL', 2.798498811425733, 'ff979797', 'fffafafa');
        const howToFix: InstancePropertyBag = validateHowToFix(testRuleId, ruleResult);
        expect(howToFix).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for TouchSizeWcag rule', () => {
        const testRuleId: string = 'TouchSizeWcag';
        const ruleResult: RuleResultsData = buildTouchSizeWcagRuleResultObject('FAIL', 2.25, 86, 95);
        const howToFix: InstancePropertyBag = validateHowToFix(testRuleId, ruleResult);
        expect(howToFix).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for ActiveViewName rule', () => {
        const howToFix: InstancePropertyBag = validateHowToFix('ActiveViewName', null);
        expect(howToFix).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for EditTextValue rule', () => {
        const howToFix: InstancePropertyBag = validateHowToFix('EditTextValue', null);
        expect(howToFix).toMatchSnapshot();
    });

    test('getRuleInformation returns correct data for ImageViewName rule', () => {
        const howToFix: InstancePropertyBag = validateHowToFix('ImageViewName', null);
        expect(howToFix).toMatchSnapshot();
    });
});
