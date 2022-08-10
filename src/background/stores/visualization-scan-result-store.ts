// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { AdHocTestkeys } from 'common/types/store-data/adhoc-test-keys';
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
    TabStopRequirementStatuses,
    VisualizationScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { forOwn, map } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { TabStopRequirementIds } from 'types/tab-stop-requirement-info';
import {
    AddTabbedElementPayload,
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from '../actions/action-payloads';
import { TabActions } from '../actions/tab-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';

export class VisualizationScanResultStore extends PersistentStore<VisualizationScanResultData> {
    constructor(
        private visualizationScanResultActions: VisualizationScanResultActions,
        private tabActions: TabActions,
        private tabStopRequirementActions: TabStopRequirementActions,
        private visualizationActions: VisualizationActions,
        private generateUID: () => string,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        persistedState: VisualizationScanResultData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.VisualizationScanResultStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.visualizationScanResultStore(tabId),
            logger,
            persistStoreData,
        );
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
                tabbingCompleted: false,
                needToCollectTabbingResults: true,
            },
        };

        const keys: AdHocTestkeys[] = [
            AdHocTestkeys.Issues,
            AdHocTestkeys.Landmarks,
            AdHocTestkeys.Headings,
            AdHocTestkeys.Color,
            AdHocTestkeys.NeedsReview,
            AdHocTestkeys.AccessibleNames,
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
        this.tabStopRequirementActions.updateTabbingCompleted.addListener(
            this.onUpdateTabbingCompleted,
        );
        this.tabStopRequirementActions.updateNeedToCollectTabbingResults.addListener(
            this.onUpdateNeedToCollectTabbingResults,
        );
        this.tabActions.existingTabUpdated.addListener(this.onExistingTabUpdated);
    }

    private onTabStopsDisabled = async (): Promise<void> => {
        this.state.tabStops.tabbedElements = null;
        await this.emitChanged();
    };

    private onResetDataForVisualization = async (type: VisualizationType): Promise<void> => {
        const config = this.visualizationConfigurationFactory.getConfiguration(type);
        const testKey = config.key;
        if (this.state[testKey] == null) {
            return;
        }

        this.state[testKey] = this.getDefaultState()[testKey];
        await this.emitChanged();
    };

    private onAddTabbedElement = async (payload: AddTabbedElementPayload): Promise<void> => {
        if (!this.state.tabStops.tabbedElements) {
            this.state.tabStops.tabbedElements = [];
        }

        let tabbedElementsWithoutTabOrder = map(this.state.tabStops.tabbedElements, element => {
            return {
                timestamp: element.timestamp,
                target: element.target,
                html: element.html,
                instanceId: element.instanceId,
            };
        });

        tabbedElementsWithoutTabOrder = tabbedElementsWithoutTabOrder.concat(
            payload.tabbedElements.map(elem => {
                return {
                    ...elem,
                    instanceId: this.generateUID(),
                };
            }),
        );

        tabbedElementsWithoutTabOrder.sort((left, right) => left.timestamp - right.timestamp);

        this.state.tabStops.tabbedElements = map(
            tabbedElementsWithoutTabOrder,
            (element, index) => {
                return {
                    ...element,
                    tabOrder: index + 1,
                };
            },
        );

        await this.emitChanged();
    };

    private onUpdateTabStopRequirementStatus = async (
        payload: UpdateTabStopRequirementStatusPayload,
    ): Promise<void> => {
        const { requirementId, status } = payload;
        this.state.tabStops.requirements[requirementId].status = status;
        if (status === 'pass') {
            this.state.tabStops.requirements[requirementId].instances = [];
        }
        await this.emitChanged();
    };

    private onResetTabStopRequirementStatus = async (
        payload: ResetTabStopRequirementStatusPayload,
    ): Promise<void> => {
        const { requirementId } = payload;
        this.state.tabStops.requirements[requirementId].status = TabStopRequirementStatuses.unknown;
        this.state.tabStops.requirements[requirementId].instances = [];
        await this.emitChanged();
    };

    private onAddTabStopInstance = async (payload: AddTabStopInstancePayload): Promise<void> => {
        const { requirementId, description, selector, html } = payload;
        this.state.tabStops.requirements[requirementId].status = 'fail';
        this.state.tabStops.requirements[requirementId].instances.push({
            description,
            id: this.generateUID(),
            selector,
            html,
        });
        await this.emitChanged();
    };

    private onUpdateTabStopInstance = async (
        payload: UpdateTabStopInstancePayload,
    ): Promise<void> => {
        const { requirementId, id, description } = payload;
        this.state.tabStops.requirements[requirementId].instances.find(
            instance => instance.id === id,
        ).description = description;
        await this.emitChanged();
    };

    private onRemoveTabStopInstance = async (
        payload: RemoveTabStopInstancePayload,
    ): Promise<void> => {
        const { requirementId, id } = payload;
        const newInstances = this.state.tabStops.requirements[requirementId].instances.filter(
            instance => instance.id !== id,
        );
        this.state.tabStops.requirements[requirementId].instances = newInstances;
        await this.emitChanged();
    };

    private onToggleTabStopRequirementExpandCollapse = async (
        payload: ToggleTabStopRequirementExpandPayload,
    ): Promise<void> => {
        const { requirementId } = payload;
        const requirement = this.state.tabStops.requirements[requirementId];
        requirement.isExpanded = !requirement.isExpanded;
        await this.emitChanged();
    };

    private onScanCompleted = async (payload: ScanCompletedPayload<any>): Promise<void> => {
        const selectorMap = payload.selectorMap;
        const result = payload.scanResult;
        const selectedRows = this.getRowToRuleResultMap(selectorMap);

        this.state[payload.key].fullIdToRuleResultMap = selectedRows;
        this.state[payload.key].fullAxeResultsMap = selectorMap;
        this.state[payload.key].scanResult = result;

        await this.emitChanged();
    };

    private onExistingTabUpdated = async (): Promise<void> => {
        this.state = this.getDefaultState();
        await this.emitChanged();
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

    private onUpdateTabbingCompleted = async (
        payload: UpdateTabbingCompletedPayload,
    ): Promise<void> => {
        this.state.tabStops.tabbingCompleted = payload.tabbingCompleted;
        await this.emitChanged();
    };

    private onUpdateNeedToCollectTabbingResults = async (
        payload: UpdateNeedToCollectTabbingResultsPayload,
    ): Promise<void> => {
        this.state.tabStops.needToCollectTabbingResults = payload.needToCollectTabbingResults;
        await this.emitChanged();
    };
}
