// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { HyperlinkDefinition } from 'views/content/content-page';
import { getRules } from '../../../../scanner/get-rules';
import { RuleSifter, RuleWithA11YCriteria } from '../../../../scanner/rule-sifter';
import { ScannerRuleInfo } from '../../../../scanner/scanner-rule-info';

describe('getDefaultRules', () => {
    let getHelpUrlMock: IMock<(rule: string, axeHelpUrl: string) => string>;
    let urlStub: string;
    let ruleSifterMock: IMock<RuleSifter>;
    let a11yCriteriaStub: HyperlinkDefinition;

    beforeEach(() => {
        urlStub = 'test url';
        a11yCriteriaStub = {} as HyperlinkDefinition;
        getHelpUrlMock = Mock.ofInstance(rule => null, MockBehavior.Strict);
        ruleSifterMock = Mock.ofType(RuleSifter, MockBehavior.Strict);
    });

    it('should return default rules', () => {
        const getRulesMock = Mock.ofInstance(Axe.getRules, MockBehavior.Strict);
        const axeStub: typeof Axe = {
            getRules: getRulesMock.object,
        } as typeof Axe;
        const helpReturnedByFunction = 'help returned by function';
        const ruleStubOne = {
            help: 'test help',
            ruleId: 'test id',
        };
        const ruleStubTwo = {
            help: () => helpReturnedByFunction,
            ruleId: 'test id two',
        };
        const ruleStubThree = {
            help: 'test help three',
            ruleId: 'test id three',
        };

        const rulesStub = [ruleStubOne, ruleStubTwo, ruleStubThree] as Axe.RuleMetadata[];

        const expected: ScannerRuleInfo[] = [
            {
                id: ruleStubOne.ruleId,
                help: ruleStubOne.help,
                url: urlStub,
                a11yCriteria: [a11yCriteriaStub],
            },
            {
                id: ruleStubTwo.ruleId,
                help: helpReturnedByFunction,
                url: urlStub,
                a11yCriteria: [a11yCriteriaStub],
            },
        ];

        const siftedRulesStub: RuleWithA11YCriteria[] = [
            {
                id: ruleStubOne.ruleId,
                a11yCriteria: [a11yCriteriaStub],
            },
            {
                id: ruleStubTwo.ruleId,
                a11yCriteria: [a11yCriteriaStub],
            },
        ];

        getRulesMock
            .setup(grm => grm())
            .returns(() => rulesStub)
            .verifiable();

        ruleSifterMock.setup(rsm => rsm.getSiftedRules()).returns(() => siftedRulesStub);

        getHelpUrlMock.setup(gchm => gchm(ruleStubOne.ruleId, It.isAny())).returns(() => urlStub);

        getHelpUrlMock.setup(gchm => gchm(ruleStubTwo.ruleId, It.isAny())).returns(() => urlStub);

        const actual = getRules(axeStub, getHelpUrlMock.object, ruleSifterMock.object);

        expect(actual).toEqual(expected);
        getRulesMock.verifyAll();
    });
});
