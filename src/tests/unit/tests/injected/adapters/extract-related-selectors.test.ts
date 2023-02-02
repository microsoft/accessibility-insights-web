// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { extractRelatedSelectors } from 'injected/adapters/extract-related-selectors';
import { AxeNodeResult, FormattedCheckResult, Target } from 'scanner/iruleresults';

describe(extractRelatedSelectors, () => {
    function checkResult(relatedTargets?: Target[]): FormattedCheckResult {
        const result: FormattedCheckResult = {
            id: 'check-id',
            message: 'check-message',
            data: {},
        };
        if (relatedTargets != null) {
            result.relatedNodes = relatedTargets.map(target => ({ html: 'related-html', target }));
        }
        return result;
    }
    it('returns undefined if there are no relatedNodes', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [checkResult()],
            any: [checkResult()],
            none: [],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toBeUndefined();
    });

    it('returns undefined if the only relatedNodes are the node itself', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [],
            any: [checkResult([['#node']])],
            none: [checkResult([['#node']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toBeUndefined();
    });

    it('extracts as-is simple targets per relatedNode', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [checkResult([['#related-1']])],
            any: [],
            none: [checkResult([['.related-2']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '.related-2']);
    });

    it('semicolon-joins array-style targets per relatedNode', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [],
            any: [checkResult([['#related-1-outer', '#related-1-inner']])],
            none: [],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1-outer;#related-1-inner']);
    });

    it('comma and semicolon joins array-of-array-style targets per relatedNode', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [],
            any: [
                checkResult([
                    [
                        ['#related-1-outer-1', '#related-1-outer-2'],
                        ['#related-1-inner-1', '#related-1-inner-2'],
                    ],
                ]),
            ],
            none: [],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual([
            '#related-1-outer-1,#related-1-outer-2;#related-1-inner-1,#related-1-inner-2',
        ]);
    });

    it('includes multiple relatedNodes from same checks', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [checkResult([['#related-1'], ['#related-2'], ['#related-3']])],
            any: [],
            none: [],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '#related-2', '#related-3']);
    });

    it('includes relatedNodes from multiple different checks', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [checkResult([['#related-1']]), checkResult([['#related-2']])],
            any: [],
            none: [checkResult([['#related-3']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '#related-2', '#related-3']);
    });

    it('omits duplicates', () => {
        const input: AxeNodeResult = {
            target: ['#node'],
            html: 'node-html',
            all: [checkResult([['#related-1']]), checkResult([['#related-2']])],
            any: [checkResult([['#related-2']]), checkResult([['#related-3']])],
            none: [checkResult([['#related-3']]), checkResult([['#related-1']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '#related-2', '#related-3']);
    });

    it.each([[[1, 2, 3]], [[3, 2, 1]], [[1, 3, 2]]])(
        'maintains original order',
        (order: number[]) => {
            const relatedSelectors = order.map(n => `#related-${n}`);

            const input: AxeNodeResult = {
                target: ['#node'],
                html: 'node-html',
                all: [
                    checkResult([[relatedSelectors[0]]]),
                    checkResult([[relatedSelectors[1]]]),
                    checkResult([[relatedSelectors[2]]]),
                ],
                any: [],
                none: [],
            };
            const output = extractRelatedSelectors(input);
            expect(output).toStrictEqual([
                relatedSelectors[0],
                relatedSelectors[1],
                relatedSelectors[2],
            ]);
        },
    );

    it('omits the node itself (passed as target)', () => {
        const input: AxeNodeResult = {
            target: ['#complex', '#node'],
            html: 'node-html',
            all: [checkResult([['#related-1']]), checkResult([['#complex', '#node']])],
            any: [],
            none: [checkResult([['#related-2']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '#related-2']);
    });

    it('omits the node itself (passed as selector)', () => {
        const input: DecoratedAxeNodeResult = {
            selector: '#complex;#node',
            ruleId: 'rule',
            all: [checkResult([['#related-1']]), checkResult([['#complex', '#node']])],
            any: [],
            none: [checkResult([['#related-2']])],
        };
        const output = extractRelatedSelectors(input);
        expect(output).toStrictEqual(['#related-1', '#related-2']);
    });
});
