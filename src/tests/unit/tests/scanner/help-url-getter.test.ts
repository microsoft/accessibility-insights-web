// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
    const getter = new HelpUrlGetter(configurationStub);

    it('should return axe help url if no custom url specified', () => {
        const ruleId = 'sampleRuleId';
        expect(getter.getHelpUrl(ruleId, axeHelpUrl)).toBe(axeHelpUrl);
    });

    it('should return custom url for custom rules', () => {
        expect(getter.getHelpUrl(customRuleId, axeHelpUrl)).toBe(`helpUrl`);
    });
});
