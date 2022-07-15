// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { AccessibilityHierarchyCheckResult } from 'electron/platform/android/atfa-data-types';

// Note: These interfaces are transitively referenced by store data, so keep backwards compatibility
// in mind when making changes.

export interface RuleResultsData {
    ruleId: string;
    status: string;
    props: any;
}

export interface AxeRuleResultsData extends RuleResultsData {
    axeViewId: string;
}

export interface ViewElementData {
    axeViewId: string;
    boundsInScreen: BoundingRectangle;
    className: string;
    contentDescription: string;
    text: string;
    children: ViewElementData[];
}

export interface BoundingRectangle {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

export interface DeviceInfo {
    dpi: number;
    name: string;
    osVersion: string;
    screenHeight: number;
    screenWidth: number;
}

export class AndroidScanResults {
    constructor(readonly rawData: any) {}

    public get deviceInfo(): DeviceInfo | null {
        return this.getAxeResults()?.axeContext?.axeDevice || null;
    }

    public get deviceName(): string | null {
        return this.getAxeResults()?.axeContext?.axeDevice?.name || null;
    }

    public get appIdentifier(): string | null {
        return this.getAxeResults()?.axeContext?.axeMetaData?.appIdentifier || null;
    }

    public get viewElementTree(): ViewElementData | null {
        return this.getAxeResults()?.axeContext?.axeView || null;
    }

    public get axeRuleResults(): AxeRuleResultsData[] {
        return this.getAxeResults()?.axeRuleResults || [];
    }

    public get axeVersion(): string {
        return this.getAxeResults()?.axeContext?.axeMetaData?.axeVersion || 'no-version';
    }

    public get analysisTimestamp(): string | null {
        return this.getAxeResults()?.axeContext?.axeMetaData?.analysisTimestamp || null;
    }

    public get screenshot(): ScreenshotData | null {
        const screenshot = this.getAxeResults()?.axeContext?.screenshot;

        return screenshot ? { base64PngData: screenshot } : null;
    }

    private getAxeResults(): any {
        return this.rawData?.AxeResults;
    }

    public get atfaResults(): AccessibilityHierarchyCheckResult[] {
        return this.rawData?.ATFAResults || [];
    }
}
