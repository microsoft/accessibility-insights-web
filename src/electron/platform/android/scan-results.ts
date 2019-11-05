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

    public get viewElementTree(): ViewElementData {
        try {
            return this.rawData.axeContext.axeView;
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

    public get axeVersion(): string {
        try {
            return this.rawData.axeContext.axeMetaData.axeVersion;
        } catch {
            return 'no-version';
        }
    }

    public get screenshot(): ScreenshotData {
        try {
            return {
                base64PngData: this.rawData.axeContext.screenshot,
            };
        } catch {
            return null;
        }
    }
}
