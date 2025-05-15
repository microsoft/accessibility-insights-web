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

    public excludeNodesByCustomLogic(rule: AxeRule): AxeRule | null {
        rule.nodes = rule.nodes.filter((nodeResult: AxeNodeResult) => {
            return !(
                rule.id === 'aria-hidden-focus' &&
                nodeResult.html.toLowerCase().includes('data-tabster-dummy')
            );
        });

        if (rule.nodes.length === 0) {
            return null;
        }

        return rule;
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
