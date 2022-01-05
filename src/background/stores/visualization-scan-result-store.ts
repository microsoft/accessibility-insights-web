// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { StoreNames } from 'common/stores/store-names';
import {
    TabStopRequirementStatuses,
    VisualizationScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from 'injected/scanner-utils';
import { forOwn, map } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { TabStopRequirementIds } from 'types/tab-stop-requirement-info';
import {
    AddTabbedElementPayload,
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from '../actions/action-payloads';
import { TabActions } from '../actions/tab-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';
import { BaseStoreImpl } from './base-store-impl';
export class VisualizationScanResultStore extends BaseStoreImpl<VisualizationScanResultData> {
    constructor(
        private visualizationScanResultActions: VisualizationScanResultActions,
        private tabActions: TabActions,
        private tabStopRequirementActions: TabStopRequirementActions,
        private visualizationActions: VisualizationActions,
        private generateUID: () => string,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {
        super(StoreNames.VisualizationScanResultStore);
    }

    public getDefaultState(): VisualizationScanResultData {
        const requirements = {};
        for (const id of TabStopRequirementIds) {
            requirements[id] = {
                status: 'unknown',
                instances: [],
                isExpanded: false,
            };
        }
        const state: Partial<VisualizationScanResultData> = {
            [AdHocTestkeys.TabStops]: {
                tabbedElements: null,
                requirements,
            },
        };

        const keys: AdHocTestkeys[] = [
            AdHocTestkeys.Issues,
            AdHocTestkeys.Landmarks,
            AdHocTestkeys.Headings,
            AdHocTestkeys.Color,
            AdHocTestkeys.NeedsReview,
        ];

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
        this.visualizationActions.resetDataForVisualization.addListener(
            this.onResetDataForVisualization,
        );
        this.visualizationScanResultActions.scanCompleted.addListener(this.onScanCompleted);
        this.visualizationScanResultActions.getCurrentState.addListener(this.onGetCurrentState);
        this.visualizationScanResultActions.addTabbedElement.addListener(this.onAddTabbedElement);
        this.visualizationScanResultActions.disableTabStop.addListener(this.onTabStopsDisabled);
        this.tabStopRequirementActions.updateTabStopsRequirementStatus.addListener(
            this.onUpdateTabStopRequirementStatus,
        );
        this.tabStopRequirementActions.resetTabStopRequirementStatus.addListener(
            this.onResetTabStopRequirementStatus,
        );
        this.tabStopRequirementActions.addTabStopInstance.addListener(this.onAddTabStopInstance);
        this.tabStopRequirementActions.updateTabStopInstance.addListener(
            this.onUpdateTabStopInstance,
        );
        this.tabStopRequirementActions.removeTabStopInstance.addListener(
            this.onRemoveTabStopInstance,
        );
        this.tabStopRequirementActions.toggleTabStopRequirementExpand.addListener(
            this.onToggleTabStopRequirementExpandCollapse,
        );
        this.tabActions.existingTabUpdated.addListener(this.onExistingTabUpdated);
    }

    private onTabStopsDisabled = (): void => {
        this.state.tabStops.tabbedElements = null;
        this.emitChanged();
    };

    private onResetDataForVisualization = (type: VisualizationType) => {
        const config = this.visualizationConfigurationFactory.getConfiguration(type);
        const testKey = config.key;
        if (this.state[testKey] == null) {
            return;
        }

        this.state[testKey] = this.getDefaultState()[testKey];
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

    private onUpdateTabStopRequirementStatus = (
        payload: UpdateTabStopRequirementStatusPayload,
    ): void => {
        const { requirementId, status } = payload;
        this.state.tabStops.requirements[requirementId].status = status;
        if (status === 'pass') {
            this.state.tabStops.requirements[requirementId].instances = [];
        }
        this.emitChanged();
    };

    private onResetTabStopRequirementStatus = (
        payload: ResetTabStopRequirementStatusPayload,
    ): void => {
        const { requirementId } = payload;
        this.state.tabStops.requirements[requirementId].status = TabStopRequirementStatuses.unknown;
        this.state.tabStops.requirements[requirementId].instances = [];
        this.emitChanged();
    };

    private onAddTabStopInstance = (payload: AddTabStopInstancePayload): void => {
        const { requirementId, description } = payload;
        this.state.tabStops.requirements[requirementId].instances.push({
            description,
            id: this.generateUID(),
        });
        this.emitChanged();
    };

    private onUpdateTabStopInstance = (payload: UpdateTabStopInstancePayload): void => {
        const { requirementId, id, description } = payload;
        this.state.tabStops.requirements[requirementId].instances.find(
            instance => instance.id === id,
        ).description = description;
        this.emitChanged();
    };

    private onRemoveTabStopInstance = (payload: RemoveTabStopInstancePayload): void => {
        const { requirementId, id } = payload;
        const newInstances = this.state.tabStops.requirements[requirementId].instances.filter(
            instance => instance.id !== id,
        );
        this.state.tabStops.requirements[requirementId].instances = newInstances;
        this.emitChanged();
    };

    private onToggleTabStopRequirementExpandCollapse = (
        payload: ToggleTabStopRequirementExpandPayload,
    ): void => {
        const { requirementId } = payload;
        const requirement = this.state.tabStops.requirements[requirementId];
        requirement.isExpanded = !requirement.isExpanded;
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
