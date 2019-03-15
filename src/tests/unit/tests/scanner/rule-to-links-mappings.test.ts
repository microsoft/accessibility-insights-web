// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';

describe('axe.commons.text.accessibleText examples', () => {
    let axe;

    beforeEach(() => {
        axe = Axe;
    });

    it('should have mappings for all axe rules', () => {
        axe.getRules().forEach(rule => {
            expect(ruleToLinkConfiguration[rule.ruleId]).not.toEqual(undefined);
        });
    });
});
