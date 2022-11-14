// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleIncluded } from 'scanner/get-rule-inclusions';
import { DictionaryStringTo } from 'types/common-types';
import { AxeOptions, AxeScanContext } from './axe-options';
import { ScanOptions } from './scan-options';

export class ScanParameterGenerator {
    constructor(private rulesIncluded: DictionaryStringTo<RuleIncluded>) {}

    public getAxeEngineOptions(options: ScanOptions): AxeOptions {
        const result: AxeOptions = {
            restoreScroll: true,
            runOnly: {
                type: 'rule',
                values: [],
            },
            pingWaitTime: 1000,
        };

        if (options == null || options.testsToRun == null) {
            result.runOnly!.values = Object.keys(this.rulesIncluded).filter(
                id => this.rulesIncluded[id].status === 'included',
            );
        } else {
            result.runOnly!.values = options.testsToRun;
        }

        return result;
    }

    public getContext(dom: Document, options: ScanOptions): AxeScanContext {
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
