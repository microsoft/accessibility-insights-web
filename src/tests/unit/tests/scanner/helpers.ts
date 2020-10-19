// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createNativeWidgetConfiguration,
    evaluateNativeWidget,
    nativeWidgetSelector,
} from '../../../../scanner/custom-rules/native-widgets-default';
import { DictionaryStringTo } from '../../../../types/common-types';

export function createNodeStub(tag: string, attributes: DictionaryStringTo<string>): HTMLElement {
    return {
        tagName: tag.toUpperCase(),
        hasAttribute: attr => attr in attributes,
        getAttribute: attr => {
            if (attr in attributes) {
                return attributes[attr] === null ? '' : attributes[attr];
            }

            return null;
        },
    } as HTMLElement;
}

export function testNativeWidgetConfiguration(
    ruleId: string,
    checkId: string,
    expectedEvaluate?: (node: any, options: any, virtualNode: any, context: any) => boolean,
    expectedMatches?: (node: any, virtualNode: any) => boolean,
): void {
    const result = createNativeWidgetConfiguration(
        ruleId,
        checkId,
        expectedEvaluate,
        expectedMatches,
    );
    expect(result.rule.id).toEqual(ruleId);
    expect(result.rule.any).toHaveLength(1);
    expect(result.rule.any![0]).toEqual(checkId);
    expect(result.rule.none).toHaveLength(1);
    expect(result.rule.none![0]).toEqual('has-widget-role');
    expect(result.rule.all).toHaveLength(1);
    expect(result.rule.all![0]).toBe('valid-role-if-present');
    expect(result.checks).toHaveLength(2);
    expect(result.checks[0].id).toEqual(checkId);
    expect(result.checks[0].evaluate).toEqual(expectedEvaluate || evaluateNativeWidget);
    expect(result.rule.selector).toBe(nativeWidgetSelector);
    if (expectedMatches) {
        expect(result.rule.matches).toEqual(expectedMatches);
    } else {
        expect(result.rule.matches).toBeUndefined();
    }
}
