// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { ruleToLinkConfiguration } from '../../../scanner/rule-to-links-mappings';

describe('axe.commons.text.accessibleText examples', () => {
    // tslint:disable-next-line:variable-name
    let _axe;
    let config;

    beforeEach(() => {
        _axe = (Axe);
        config = ruleToLinkConfiguration;
    });

    it('should have mappings for all axe rules', () => {
        _axe.getRules().forEach(rule => {
            expect(config[rule.ruleId]).not.toEqual(undefined);
        });
    });
});
