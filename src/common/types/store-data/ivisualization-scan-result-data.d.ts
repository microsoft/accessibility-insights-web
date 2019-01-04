// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IHtmlElementAxeResults, DecoratedAxeNodeResult } from '../../../injected/scanner-utils';
import { ITabStopEvent } from '../../../injected/tab-stops-listener';
import { ITabOrderPropertyBag } from '../../../injected/tab-order-property-bag';

export interface IScanResultData<TSelector> {
    fullAxeResultsMap: IDictionaryStringTo<TSelector>;
    scanResult?: ScanResults;
}

export interface IIssuesScanResultData extends IScanResultData<IHtmlElementAxeResults> {
    selectedAxeResultsMap: IDictionaryStringTo<IHtmlElementAxeResults>;
    selectedIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
    fullIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
}

export type ILandmarksScanResultData = IScanResultData<IHtmlElementAxeResults>;
export type IHeadingsScanResultData = IScanResultData<IHtmlElementAxeResults>;
export type IColorScanResultData = IScanResultData<IHtmlElementAxeResults>;

export interface ITabbedElementData extends ITabStopEvent {
    tabOrder: number;
    propertyBag?: ITabOrderPropertyBag;
}

export interface ITabStopsScanResultData {
    tabbedElements: ITabbedElementData[];
}

export interface IVisualizationScanResultData {
    issues: IIssuesScanResultData;
    landmarks: IIssuesScanResultData;
    headings: IIssuesScanResultData;
    color: IIssuesScanResultData;
    tabStops: ITabStopsScanResultData;
}
