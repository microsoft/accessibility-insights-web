// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';

describe('axe.commons.text.accessibleText examples', () => {
    const axe = Axe as any;

    axe.getRules().forEach(rule => {
        it(`should have mapping for ${rule.ruleId}`, () => {
            expect(ruleToLinkConfiguration[rule.ruleId]).not.toEqual(undefined);
        });
    });
});
