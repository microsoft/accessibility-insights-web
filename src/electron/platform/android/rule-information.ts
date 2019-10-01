// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleResultsData } from './scan-results';

export type HowToFixDelegate = (ruleResultsData: RuleResultsData) => string;

export class RuleInformation {
    constructor(readonly RuleId: string, readonly RuleDescription: string, readonly howToFixDelegate: HowToFixDelegate) {}

    public get ruleId(): string {
        return this.RuleId;
    }

    public get ruleDescription(): string {
        return this.RuleDescription;
    }

    public howToFix(ruleResultsData: RuleResultsData): string {
        return this.howToFixDelegate(ruleResultsData);
    }
}
