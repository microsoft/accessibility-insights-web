// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface RuleResultsData {
    ruleId: string;
    status: string;
    props: any;
}

export class ScanResults {
    constructor(readonly rawData: any) {}

    public get deviceName(): string {
        try {
            return this.rawData.axeContext.axeDevice.name;
        } catch {
            return null;
        }
    }

    public get appIdentifier(): string {
        try {
            return this.rawData.axeContext.axeMetaData.appIdentifier;
        } catch {
            return null;
        }
    }

    public get ruleResults(): RuleResultsData[] {
        try {
            const results = this.rawData.axeRuleResults;
            return results || [];
        } catch {
            return [];
        }
    }
}
