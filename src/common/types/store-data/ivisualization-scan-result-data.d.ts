// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult, IHtmlElementAxeResults } from '../../../injected/scanner-utils';
import { ITabOrderPropertyBag } from '../../../injected/tab-order-property-bag';
import { ITabStopEvent } from '../../../injected/tab-stops-listener';

// tslint:disable-next-line:interface-name
interface IScanResultData<TSelector> {
    fullAxeResultsMap: IDictionaryStringTo<TSelector>;
    scanResult?: ScanResults;
}

// tslint:disable-next-line:interface-name
export interface IIssuesScanResultData extends IScanResultData<IHtmlElementAxeResults> {
    selectedAxeResultsMap: IDictionaryStringTo<IHtmlElementAxeResults>;
    selectedIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
    fullIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
}

// tslint:disable-next-line:interface-name
export interface ITabbedElementData extends ITabStopEvent {
    tabOrder: number;
    propertyBag?: ITabOrderPropertyBag;
}

// tslint:disable-next-line:interface-name
export interface ITabStopsScanResultData {
    tabbedElements: ITabbedElementData[];
}

// tslint:disable-next-line:interface-name
export interface IVisualizationScanResultData {
    issues: IIssuesScanResultData;
    landmarks: IIssuesScanResultData;
    headings: IIssuesScanResultData;
    color: IIssuesScanResultData;
    tabStops: ITabStopsScanResultData;
}
