// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleResultsData } from './scan-results';

export type HowToFixDelegate = (ruleResultsData: RuleResultsData) => string;

export class RuleInformation {
    private RuleId: string;
    private RuleDescription: string;
    private HowToFixDelegate: HowToFixDelegate;

    constructor(ruleId: string, ruleDescription: string, howToFixDelegate: HowToFixDelegate) {
        this.RuleId = ruleId;
        this.RuleDescription = ruleDescription;
        this.HowToFixDelegate = howToFixDelegate;
    }

    public get ruleId(): string {
        return this.RuleId;
    }

    public get ruleDescription(): string {
        return this.RuleDescription;
    }

    public howToFix(ruleResultsData: RuleResultsData): string {
        return this.HowToFixDelegate(ruleResultsData);
    }
}
