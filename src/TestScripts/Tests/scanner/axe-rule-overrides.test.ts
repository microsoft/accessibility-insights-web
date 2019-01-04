// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { Mock, MockBehavior, Times } from 'typemoq';

import { AxeRuleOverrides } from '../../../scanner/axe-rule-overrides';

/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

describe('AriaAllowedAttrOveride', () => {

    describe('overide', () => {
        it('should call configure with the configuration', () => {
            const axeMock = Mock.ofInstance({ configure: config => null }, MockBehavior.Strict);

            axeMock
                .setup(am => am.configure(AxeRuleOverrides.overrideConfiguration))
                .verifiable(Times.once());

            AxeRuleOverrides.overide(axeMock.object as typeof Axe);
            axeMock.verifyAll();
        });
    });
});
