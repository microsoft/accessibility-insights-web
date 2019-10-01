// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleResultsData } from './scan-results';

export type HowToFixDelegate = (ruleResultsData: RuleResultsData) => string;

export class RuleInformation {
    constructor(readonly ruleId: string, readonly ruleDescription: string, readonly howToFixDelegate: HowToFixDelegate) {}

    public howToFix(ruleResultsData: RuleResultsData): string {
        return this.howToFixDelegate(ruleResultsData);
    }
}
