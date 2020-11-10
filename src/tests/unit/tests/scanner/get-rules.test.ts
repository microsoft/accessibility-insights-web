// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { RuleIncluded } from 'scanner/get-rule-inclusions';
import { getRules } from 'scanner/get-rules';
import { ScannerRuleInfo } from 'scanner/scanner-rule-info';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('getDefaultRules', () => {
    let getHelpUrlMock: IMock<(rule: string, axeHelpUrl: string) => string>;
    let urlStub: string;
    let a11yCriteriaStub: HyperlinkDefinition;

    beforeEach(() => {
        urlStub = 'test url';
        a11yCriteriaStub = {} as HyperlinkDefinition;
        getHelpUrlMock = Mock.ofInstance(rule => null, MockBehavior.Strict);
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

        const ruleToLinkStub: DictionaryStringTo<HyperlinkDefinition[]> = Object.assign(
            {},
            ...rulesStub.map(r => ({ [r.ruleId]: [a11yCriteriaStub] })),
        );
        const ruleIncludedStub: DictionaryStringTo<RuleIncluded> = {
            [ruleStubOne.ruleId]: {
                status: 'included',
                reason: null,
            },
            [ruleStubTwo.ruleId]: {
                status: 'included',
                reason: null,
            },
            [ruleStubThree.ruleId]: {
                status: 'excluded',
                reason: 'no guidance link mapping',
            },
        };

        getRulesMock
            .setup(grm => grm())
            .returns(() => rulesStub)
            .verifiable();

        getHelpUrlMock.setup(gchm => gchm(ruleStubOne.ruleId, It.isAny())).returns(() => urlStub);

        getHelpUrlMock.setup(gchm => gchm(ruleStubTwo.ruleId, It.isAny())).returns(() => urlStub);

        const actual = getRules(axeStub, getHelpUrlMock.object, ruleIncludedStub, ruleToLinkStub);

        expect(actual).toEqual(expected);
        getRulesMock.verifyAll();
    });
});
