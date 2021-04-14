// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StoreNames } from 'common/stores/store-names';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from 'injected/scanner-utils';
import { forOwn, map } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { AddTabbedElementPayload } from '../actions/action-payloads';
import { TabActions } from '../actions/tab-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';
import { BaseStoreImpl } from './base-store-impl';

export class VisualizationScanResultStore extends BaseStoreImpl<VisualizationScanResultData> {
    private visualizationScanResultsActions: VisualizationScanResultActions;
    private tabActions: TabActions;

    constructor(
        visualizationScanResultActions: VisualizationScanResultActions,
        tabActions: TabActions,
    ) {
        super(StoreNames.VisualizationScanResultStore);

        this.visualizationScanResultsActions = visualizationScanResultActions;
        this.tabActions = tabActions;
    }

    public getDefaultState(): VisualizationScanResultData {
        const state: Partial<VisualizationScanResultData> = {
            tabStops: {
                tabbedElements: null,
            },
        };

        const keys = ['issues', 'landmarks', 'headings', 'color', 'needsReview'];

        keys.forEach(key => {
            state[key] = {
                fullAxeResultsMap: null,
                scanResult: null,
                fullIdToRuleResultMap: null,
            };
        });

        return state as VisualizationScanResultData;
    }

    protected addActionListeners(): void {
        this.visualizationScanResultsActions.scanCompleted.addListener(this.onScanCompleted);
        this.visualizationScanResultsActions.getCurrentState.addListener(this.onGetCurrentState);
        this.visualizationScanResultsActions.disableIssues.addListener(this.onIssuesDisabled);
        this.visualizationScanResultsActions.addTabbedElement.addListener(this.onAddTabbedElement);
        this.visualizationScanResultsActions.disableTabStop.addListener(this.onTabStopsDisabled);

        this.tabActions.existingTabUpdated.addListener(this.onExistingTabUpdated);
    }

    private onTabStopsDisabled = (): void => {
        this.state.tabStops.tabbedElements = null;
        this.emitChanged();
    };

    private onAddTabbedElement = (payload: AddTabbedElementPayload): void => {
        if (!this.state.tabStops.tabbedElements) {
            this.state.tabStops.tabbedElements = [];
        }

        let tabbedElementsWithoutTabOrder: TabStopEvent[] = map(
            this.state.tabStops.tabbedElements,
            element => {
                return {
                    timestamp: element.timestamp,
                    target: element.target,
                    html: element.html,
                };
            },
        );

        tabbedElementsWithoutTabOrder = tabbedElementsWithoutTabOrder.concat(
            payload.tabbedElements,
        );
        tabbedElementsWithoutTabOrder.sort((left, right) => left.timestamp - right.timestamp);

        this.state.tabStops.tabbedElements = map(
            tabbedElementsWithoutTabOrder,
            (element, index) => {
                return {
                    timestamp: element.timestamp,
                    target: element.target,
                    html: element.html,
                    tabOrder: index + 1,
                };
            },
        );

        this.emitChanged();
    };

    private onScanCompleted = (payload: ScanCompletedPayload<any>): void => {
        const selectorMap = payload.selectorMap;
        const result = payload.scanResult;
        const selectedRows = this.getRowToRuleResultMap(selectorMap);

        this.state[payload.key].fullIdToRuleResultMap = selectedRows;
        this.state[payload.key].fullAxeResultsMap = selectorMap;
        this.state[payload.key].scanResult = result;

        this.emitChanged();
    };

    private onIssuesDisabled = (): void => {
        this.state.issues.scanResult = null;
        this.emitChanged();
    };

    private onExistingTabUpdated = (): void => {
        this.state = this.getDefaultState();
        this.emitChanged();
    };

    private getRowToRuleResultMap(
        selectorMap: DictionaryStringTo<HtmlElementAxeResults>,
    ): DictionaryStringTo<DecoratedAxeNodeResult> {
        const selectedRows: DictionaryStringTo<DecoratedAxeNodeResult> = {};

        forOwn(selectorMap, (selector: HtmlElementAxeResults) => {
            const ruleResults = selector.ruleResults;

            forOwn(ruleResults, (rule: DecoratedAxeNodeResult) => {
                selectedRows[rule.id] = rule;
            });
        });

        return selectedRows;
    }
}
