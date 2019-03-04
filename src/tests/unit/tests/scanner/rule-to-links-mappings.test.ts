// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';
import axe = require('axe-core');
import { RuleConfiguration } from '../../../../scanner/iruleresults';

describe('rule-to-links-mappings', () => {
    // tslint:disable-next-line:variable-name
    let _axe = Axe as any;
    let config;

    beforeEach(() => {
        _axe = Axe;
        config = ruleToLinkConfiguration;
    });

    _axe.getRules().forEach(rule => {
        it(`should have mapping for ${rule.ruleId}`, () => {
            expect(config[rule.ruleId]).not.toEqual(undefined);
        });
    });
});
