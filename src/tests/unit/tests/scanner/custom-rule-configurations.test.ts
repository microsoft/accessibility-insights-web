// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configuration } from '../../../../scanner/custom-rule-configurations';
import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';

describe('CustomRuleConfiguration', () => {
    it('contains items which are all either disabled or have rule-to-links mappings', () => {
        for (const config of configuration) {
            const isDisabled = config.rule.enabled === false;
            const ruleToLinks =
                ruleToLinkConfiguration[config.rule.id] !== undefined;
            expect(isDisabled || ruleToLinks).toBeTruthy();
        }
    });
});
