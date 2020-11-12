// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';

export class HelpUrlGetter {
    constructor(
        private readonly ruleConfigs: RuleConfiguration[],
        private readonly getA11yInsightsHelpUrl: (ruleId: string) => string | null,
    ) {}

    public getHelpUrl(ruleId: string, axeHelpUrl?: string): string | undefined {
        const customHelpUrl = this.getCustomHelpUrl(ruleId);
        const a11yInsightsHelpUrl = this.getA11yInsightsHelpUrl(ruleId);

        return customHelpUrl || a11yInsightsHelpUrl || axeHelpUrl;
    }

    private getCustomHelpUrl(ruleId: string): string | null {
        for (let index = 0; index < this.ruleConfigs.length; index++) {
            const config = this.ruleConfigs[index];
            if (config.rule.id === ruleId && config.rule.helpUrl != null) {
                return config.rule.helpUrl;
            }
        }

        return null;
    }
}
