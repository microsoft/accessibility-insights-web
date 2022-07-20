// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
declare interface AxeResult {
    passes: AxeRule[];
    violations: AxeRule[];
}

declare interface AxeRule {
    id: string;
    nodes: AxeNodeResult[];
    description?: string;
    help?: string;
}

declare interface AxeNodeResult {
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
    html: string;
    target: (string | string[])[]; // selector
    failureSummary?: string;
    instanceId?: string;
    snippet?: string;
}

declare interface LandmarkValue {
    selectors: string[];
    label: string[];
    borderColor: string;
    fontColor: string;
}

declare function getAxeResults(
    rulesToTest: string[],
    successCallback: (axeResults: AxeResult) => void,
    errCallback: (err: any) => void,
);
