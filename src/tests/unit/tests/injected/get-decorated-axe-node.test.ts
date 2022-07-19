// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixWebPropertyData } from 'common/components/cards/how-to-fix-card-row';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { getDecoratedAxeNode } from 'injected/get-decorated-axe-node';
import { exampleUnifiedResult } from 'tests/unit/tests/common/components/cards/sample-view-model-data';

describe('GetDecoratedAxeNodeResult', () => {
    test('gets relevant node', () => {
        const unifiedResult: UnifiedResult = exampleUnifiedResult;
        const unifiedRule: UnifiedRule = {
            id: 'some rule',
            guidance: [{} as GuidanceLink],
            description: 'some description',
            url: 'some url',
        };
        const selectorStub = 'some selector';

        const howToFixData = unifiedResult.resolution['how-to-fix-web'] as HowToFixWebPropertyData;
        const expectedResult = {
            status: false,
            ruleId: unifiedResult.ruleId,
            failureSummary: unifiedResult.resolution.howToFixSummary,
            selector: selectorStub,
            guidanceLinks: unifiedRule.guidance,
            help: unifiedRule.description,
            helpUrl: unifiedRule.url,
            html: unifiedResult.descriptors.snippet,
            id: unifiedResult.uid,
            any: howToFixData.any.map(s => {
                return {
                    message: s,
                };
            }),
            all: howToFixData.all.map(s => {
                return {
                    message: s,
                };
            }),
            none: howToFixData.none.map(s => {
                return {
                    message: s,
                };
            }),
        };

        expect(getDecoratedAxeNode(unifiedResult, unifiedRule, selectorStub)).toEqual(
            expectedResult,
        );
    });

    test('gets relevant node with no how-to-fix data', () => {
        const unifiedResult: UnifiedResult = exampleUnifiedResult;
        unifiedResult.resolution = {
            howToFixSummary: 'sample how to fix summary',
            richHowToCheck: 'sample how to check text',
        };
        const unifiedRule: UnifiedRule = {
            id: 'some rule',
            guidance: [{} as GuidanceLink],
            description: 'some description',
            url: 'some url',
        };
        const selectorStub = 'some selector';

        const expectedResult = {
            status: false,
            ruleId: unifiedResult.ruleId,
            failureSummary: unifiedResult.resolution.howToFixSummary,
            selector: selectorStub,
            guidanceLinks: unifiedRule.guidance,
            help: unifiedRule.description,
            helpUrl: unifiedRule.url,
            html: unifiedResult.descriptors.snippet,
            id: unifiedResult.uid,
        };

        expect(getDecoratedAxeNode(unifiedResult, unifiedRule, selectorStub)).toEqual(
            expectedResult,
        );
    });
});
