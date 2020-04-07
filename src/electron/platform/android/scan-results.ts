// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';

export interface RuleResultsData {
    axeViewId: string;
    ruleId: string;
    status: string;
    props: any;
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

export class ScanResults {
    constructor(readonly rawData: any) {}

    public get deviceInfo(): DeviceInfo {
        return this.rawData?.axeContext?.axeDevice || null;
    }

    public get deviceName(): string {
        return this.rawData?.axeContext?.axeDevice?.name || null;
    }

    public get appIdentifier(): string {
        return this.rawData?.axeContext?.axeMetaData?.appIdentifier || null;
    }

    public get viewElementTree(): ViewElementData {
        return this.rawData?.axeContext?.axeView || null;
    }

    public get ruleResults(): RuleResultsData[] {
        return this.rawData?.axeRuleResults || [];
    }

    public get axeVersion(): string {
        return this.rawData?.axeContext?.axeMetaData?.axeVersion || 'no-version';
    }

    public get analysisTimestamp(): string {
        return this.rawData?.axeContext?.axeMetaData?.analysisTimestamp || null;
    }

    public get screenshot(): ScreenshotData {
        const screenshot = this.rawData?.axeContext?.screenshot;

        return screenshot ? { base64PngData: screenshot } : null;
    }
}
