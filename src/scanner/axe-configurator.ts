// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import {
    IAxeConfiguration,
    ICheckConfiguration,
    IRuleConfiguration,
    RuleConfiguration,
} from './iruleresults';
import { localeConfiguration } from './locale-configuration';

export class AxeConfigurator {
    public configureAxe(axe: typeof Axe, configuration: RuleConfiguration[]): void {
        axe.configure({ branding: 'msftAI' });
        axe.configure(this.createAxeConfigurationFromCustomRules(configuration) as any);
        axe.configure({ locale: localeConfiguration });
    }

    private createAxeConfigurationFromCustomRules(
        ruleConfigs: RuleConfiguration[],
    ): IAxeConfiguration {
        let checks: ICheckConfiguration[] = [];
        const rules: IRuleConfiguration[] = [];
        ruleConfigs.forEach((ruleConfig: RuleConfiguration) => {
            checks = checks.concat(ruleConfig.checks);
            rules.push(ruleConfig.rule);
        });

        return {
            checks: checks,
            rules: rules,
        };
    }
}
