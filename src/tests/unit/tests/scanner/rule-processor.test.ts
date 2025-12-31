// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeNodeResult, AxeRule, FormattedCheckResult } from 'scanner/iruleresults';
import { RuleProcessor } from 'scanner/rule-processor';
import { DictionaryStringTo } from 'types/common-types';

describe('RuleProcessor', () => {
    let suppressedChecks: DictionaryStringTo<FormattedCheckResult>;
    let nonSuppressedCheck: FormattedCheckResult;
    let testSubject: RuleProcessor;

    beforeEach(() => {
        testSubject = new RuleProcessor([
            'Required ARIA child role not present: listbox',
            'Required ARIA child role not present: textbox',
        ]);

        suppressedChecks = {
            requiredChildrenListbox: {
                id: 'suppressed-check',
                message: 'Required ARIA child role not present: listbox',
                data: null,
            },
            requiredChildrenTextbox: {
                id: 'suppressed-check',
                message: 'Required ARIA child role not present: textbox',
                data: null,
            },
        };
        nonSuppressedCheck = {
            id: 'non-suppressed-check',
            message: null,
            data: null,
        };
    });

    it('suppressChecksByMessages: removes only suppressed checks.', () => {
        const initialRuleResult: AxeNodeResult = {
            any: [
                suppressedChecks.requiredChildrenListbox,
                suppressedChecks.requiredChildrenTextbox,
                nonSuppressedCheck,
            ],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [initialRuleResult],
            description: 'description',
        };
        const expectedAxeRuleResult: AxeNodeResult = {
            any: [nonSuppressedCheck],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const expectedAxeRule: AxeRule = {
            id: '',
            nodes: [expectedAxeRuleResult],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule);

        expect(actual).toEqual(expectedAxeRule);
    });

    it('suppressChecksByMessages: nodes are unaltered if nothing is removed.', () => {
        const initialRuleResult: AxeNodeResult = {
            any: [nonSuppressedCheck],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [initialRuleResult],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule);

        expect(actual).toEqual(initialAxeRule);
    });

    it('suppressChecksByMessages: do not suppress for inapplicable', () => {
        const resultStub: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [resultStub],
            description: 'description',
        };
        const expectedAxeRule: AxeRule = {
            id: '',
            nodes: [],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule, false);
        expect(actual).toEqual(expectedAxeRule);
    });

    it('suppressChecksByMessages: ignore the casing/trailing spaces of the suppressed message', () => {
        const initialRuleResult: AxeNodeResult = {
            any: [suppressedChecks.requiredChildrenListbox, nonSuppressedCheck],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [initialRuleResult],
            description: 'description',
        };
        const expectedAxeRuleResult: AxeNodeResult = {
            any: [nonSuppressedCheck],
            none: [],
            all: [],
            html: null,
            target: null,
        };
        const expectedAxeRule: AxeRule = {
            id: '',
            nodes: [expectedAxeRuleResult],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule);
        expect(actual).toEqual(expectedAxeRule);
    });

    it('suppressChecksByMessages: Remove a node that only has one check which is suppressed', () => {
        const removedResult: AxeNodeResult = {
            any: [suppressedChecks.requiredChildrenListbox],
            none: [],
            all: [],
            html: null,
            target: null,
        };

        const nonRemovedResult: AxeNodeResult = {
            any: [nonSuppressedCheck],
            none: [],
            all: [],
            html: null,
            target: null,
        };

        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [removedResult, nonRemovedResult],
            description: 'description',
        };
        const expectedAxeRule: AxeRule = {
            id: '',
            nodes: [nonRemovedResult],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule);
        expect(actual).toEqual(expectedAxeRule);
    });

    it('suppressChecksByMessages: return null if no nodes are left', () => {
        const removedResult: AxeNodeResult = {
            any: [suppressedChecks.requiredChildrenListbox],
            none: [],
            all: [],
            html: null,
            target: null,
        };

        const initialAxeRule: AxeRule = {
            id: '',
            nodes: [removedResult],
            description: 'description',
        };

        const actual = testSubject.suppressChecksByMessages(initialAxeRule);
        expect(actual).toBeNull();
    });

    it('suppressFluentUITabsterResult: removes only Tabster dummy nodes and retains valid errors', () => {
        const falsePositiveNode: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            html: '<i tabindex="0" data-tabster-dummy="" aria-hidden="true">hello1</i>',
            target: ['#falsePositive'],
        };

        const trueErrorNode: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            html: '<i tabindex="0" aria-hidden="true">hello2</i>',
            target: ['#trueError'],
        };

        const initialAxeRule: AxeRule = {
            id: 'aria-hidden-focus',
            nodes: [falsePositiveNode, trueErrorNode],
            description: 'aria hidden focus issue',
        };

        const expectedAxeRule: AxeRule = {
            id: 'aria-hidden-focus',
            nodes: [trueErrorNode],
            description: 'aria hidden focus issue',
        };

        const actual = testSubject.suppressFluentUITabsterResult(initialAxeRule);
        expect(actual).toEqual(expectedAxeRule);
    });
});
