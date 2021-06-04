// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeNodeResult, AxeRule } from './iruleresults';

function normalizeText(text: string): string {
    return text.toLowerCase().trim();
}

export namespace Processor {
    // eslint-disable-next-line prefer-const
    export let suppressedMessages = [
        // add messages to suppress here. Remove comment when non-empty.
    ].map(normalizeText);

    export function suppressChecksByMessages(
        rule: AxeRule,
        removeEmptyRules = true,
    ): AxeRule | null {
        rule.nodes = rule.nodes.filter((nodeResult: AxeNodeResult) => {
            nodeResult.any = nodeResult.any.filter((check: any) => {
                const checkShown =
                    check.message != null
                        ? suppressedMessages.indexOf(normalizeText(check.message)) < 0
                        : true;

                return checkShown;
            });

            return (
                nodeResult.any.length > 0 || nodeResult.none.length > 0 || nodeResult.all.length > 0
            );
        });

        if (removeEmptyRules && rule.nodes.length === 0) {
            return null;
        }

        return rule;
    }
}
