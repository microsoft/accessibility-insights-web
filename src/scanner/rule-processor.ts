// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeNodeResult, AxeRule } from './iruleresults';

export class RuleProcessor {
    normalizedSuppressedMessages: string[];

    public constructor(suppressedMessages?: string[]) {
        this.normalizedSuppressedMessages = (suppressedMessages ?? []).map(this.normalizeMessage);
    }

    public suppressChecksByMessages(rule: AxeRule, removeEmptyRules = true): AxeRule | null {
        rule.nodes = rule.nodes.filter((nodeResult: AxeNodeResult) => {
            nodeResult.any = nodeResult.any.filter(
                (check: any) => !this.shouldSuppressMessage(check.message),
            );

            return (
                nodeResult.any.length > 0 || nodeResult.none.length > 0 || nodeResult.all.length > 0
            );
        });

        if (removeEmptyRules && rule.nodes.length === 0) {
            return null;
        }

        return rule;
    }

    public suppressFluentUITabsterResult(result: AxeRule): AxeRule {
        /**
         * [False Positive] aria-hidden-focus on elements with data-tabster-dummy #2769
         * Resolves a known issue with Fluent UI, which uses Tabster to manage focus.
         * Tabster inserts hidden but focusable elements into the DOM, which can trigger
         * false positives for the 'aria-hidden-focus' rule in WCP accessibility scans.
         */

        if (result.id === 'aria-hidden-focus') {
            result.nodes = result.nodes.filter(node => {
                return !node.html.includes('data-tabster-dummy');
            });
        }
        return result;
    }

    private normalizeMessage(message: string): string {
        return message.toLowerCase().trim();
    }

    private shouldSuppressMessage(message: string | null): boolean {
        if (message == null) {
            return false;
        }

        const normalizedMessage = this.normalizeMessage(message);
        return this.normalizedSuppressedMessages.includes(normalizedMessage);
    }
}
