// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';
import { HelpUrlGetter } from '../../../../scanner/help-url-getter';
import { RuleConfiguration } from '../../../../scanner/iruleresults.d';

describe('getHelpUrl', () => {
    const customRuleId = 'custom-rule';
    const customUrl = 'helpUrl';
    const configurationStub = [
        {
            rule: {
                id: customRuleId,
                helpUrl: customUrl,
            },
        } as RuleConfiguration,
    ];
    const axeHelpUrl = 'axe help';
    const a11yInsightsHelpUrl = 'a11y insights help';
    let getRuleResourceMock: IMock<(ruleId: string) => string | null>;
    let getter: HelpUrlGetter;

    beforeEach(() => {
        getRuleResourceMock = Mock.ofInstance(() => null);
        getter = new HelpUrlGetter(configurationStub, getRuleResourceMock.object);
    });

    it('should return axe help url if no custom url specified and no a11y insights page available', () => {
        const ruleId = 'sampleRuleId';
        expect(getter.getHelpUrl(ruleId, axeHelpUrl)).toBe(axeHelpUrl);
    });

    it('should return a11y insights url if one is available and no custom url specified', () => {
        const ruleId = 'sampleRuleId';
        getRuleResourceMock.setup(grr => grr(ruleId)).returns(() => a11yInsightsHelpUrl);
        expect(getter.getHelpUrl(ruleId, axeHelpUrl)).toBe(a11yInsightsHelpUrl);
    });

    it('should return custom url for custom rules', () => {
        expect(getter.getHelpUrl(customRuleId, axeHelpUrl)).toBe(`helpUrl`);
    });
});
