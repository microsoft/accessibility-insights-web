// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InstancePropertyBag } from 'common/types/store-data/unified-data-interface';
import { RuleResultsData } from './scan-results';

export type HowToFixDelegate = (ruleResultsData: RuleResultsData) => InstancePropertyBag;

export class RuleInformation {
    constructor(readonly ruleId: string, readonly ruleDescription: string, readonly howToFixDelegate: HowToFixDelegate) {}

    public howToFix(ruleResultsData: RuleResultsData): InstancePropertyBag {
        return this.howToFixDelegate(ruleResultsData);
    }
}
