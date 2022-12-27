// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { keyBy } from 'lodash';
import { configuration } from 'scanner/custom-rule-configurations';
import { mapAxeTagsToGuidanceLinks } from 'scanner/map-axe-tags-to-guidance-links';

describe('CustomRuleConfiguration', () => {
    const configurationsById = keyBy(configuration, c => c.rule.id);
    describe.each(Object.keys(configurationsById))('configuration for rule %s', id => {
        const config = configurationsById[id];

        it('is either disabled or has guidance link mappings', () => {
            const isDisabled = config.rule.enabled === false;
            const guidanceLinks = mapAxeTagsToGuidanceLinks(id, config.rule.tags);
            const hasGuidanceLinks = guidanceLinks.length > 0;
            expect(isDisabled || hasGuidanceLinks).toBeTruthy();
        });
    });
});
