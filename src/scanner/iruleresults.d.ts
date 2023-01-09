// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Note: These interfaces are transitively referenced by store data, so keep backwards compatibility
// in mind when making changes.

export interface AxeRule {
    id: string;
    nodes: AxeNodeResult[];
    description?: string;
    helpUrl?: string;
    help?: string;
    tags?: string[];
}

export type Target = (string | string[])[];

export interface AxeNodeResult {
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
    html: string;
    target: Target; // selector
    failureSummary?: string;
    instanceId?: string;
    snippet?: string;
}

export interface RuleConfiguration {
    checks: ICheckConfiguration[];
    rule: IRuleConfiguration;
}

export interface IAxeConfiguration {
    checks?: ICheckConfiguration[];
    rules?: IRuleConfiguration[];
}

export interface IRuleConfiguration {
    id: string;
    selector: string;
    excludeHidden?: boolean;
    enabled?: boolean;
    pageLevel?: boolean;
    any?: string[];
    all?: string[];
    none?: string[];
    tags?: string[];
    matches?: (node: any, virtualNode: any) => boolean;
    description?: string;
    help?: string;
    options?: any;
    decorateNode?: (node: AxeNodeResult) => void;
    helpUrl?: string;
}

export interface ICheckConfiguration {
    id: string;
    evaluate: (node: any, options: any, virtualNode: any, context: any) => boolean;
    after?: any;
    options?: any;
    enabled?: boolean;
    passMessage?: () => string;
    failMessage?: () => string;
}

export interface FormattedCheckResult {
    id: string;
    message: string;
    data: IAxeCheckResultExtraData;
    result?: boolean;
}

export interface IAxeCheckResultExtraData {
    headingLevel?: number;
    headingText?: string;
}

export interface IAxeCheckResultFrameExtraData {
    frameType?: string;
    frameTitle?: string;
}

export type RuleResult = AxeRule & RuleDecorations;

export interface ScanResults {
    passes: RuleResult[];
    violations: RuleResult[];
    inapplicable: RuleResult[];
    incomplete: RuleResult[];
    timestamp: string;
    targetPageUrl: string;
    targetPageTitle: string;
    framesSkipped: boolean?;
}

export interface RuleDecorations {
    guidanceLinks?: GuidanceLink[];
    helpUrl?: string;
}
