// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanOptions } from './exposed-apis';
import { AxeOptions, AxeScanContext } from './launcher';
import { RuleSifter } from './rule-sifter';

export class ScanParamaterGenerator {
    constructor(private ruleSifter: RuleSifter) {}

    public getAxeEngineOptions(options: ScanOptions): AxeOptions {
        const result: AxeOptions = {
            restoreScroll: true,
            runOnly: {
                type: 'rule',
            },
        };

        if (options == null || options.testsToRun == null) {
            result.runOnly.values = this.ruleSifter.getSiftedRules().map(rule => rule.id);
        } else {
            result.runOnly.values = options.testsToRun;
        }

        return result;
    }

    public getContext(dom: NodeSelector & Node, options: ScanOptions): AxeScanContext {
        if (options == null) {
            return dom;
        }

        if (options.dom) {
            return options.dom;
        } else if (options.selector) {
            return options.selector;
        } else if (options.include || options.exclude) {
            return {
                include: options.include,
                exclude: options.exclude,
            };
        } else {
            return dom;
        }
    }
}
