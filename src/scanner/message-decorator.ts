// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CheckMessageTransformer } from './check-message-transformer';
import { AxeRule, RuleConfiguration } from './iruleresults';

export class MessageDecorator {
    private configuration: RuleConfiguration[];
    private checkMessageCreator: CheckMessageTransformer;
    constructor(configuration: RuleConfiguration[], checkMessageCreator: CheckMessageTransformer) {
        this.configuration = configuration;
        this.checkMessageCreator = checkMessageCreator;
    }

    public decorateResultWithMessages(results: AxeRule): void {
        const ruleConfiguration = this.configuration
            .filter(config => config.rule.id === results.id)
            .pop();

        if (ruleConfiguration == null) {
            return;
        }

        results.description = ruleConfiguration.rule.description ?? 'No description is available';
        results.help = ruleConfiguration.rule.help;

        results.nodes.forEach(resultNode => {
            this.checkMessageCreator.addMessagesToChecks(resultNode.all, ruleConfiguration.checks);
            this.checkMessageCreator.addMessagesToChecks(resultNode.none, ruleConfiguration.checks);
            this.checkMessageCreator.addMessagesToChecks(resultNode.any, ruleConfiguration.checks);
            if (ruleConfiguration.rule.decorateNode) {
                ruleConfiguration.rule.decorateNode(resultNode);
            }
        });
    }
}
