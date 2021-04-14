// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AddTabbedElementPayload } from 'background/actions/action-payloads';
import { TabActions } from 'background/actions/tab-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    TabbedElementData,
    VisualizationScanResultData,
} from '../../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ScanResults } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';

describe('VisualizationScanResultStoreTest', () => {
    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(VisualizationScanResultStore);

        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(VisualizationScanResultStore);

        expect(testObject.getId()).toBe(StoreNames[StoreNames.VisualizationScanResultStore]);
    });

    test('onGetCurrentState', () => {
        const actionName = 'getCurrentState';

        const initialState = new VisualizationScanResultStoreDataBuilder().build();
        const finalState = new VisualizationScanResultStoreDataBuilder().build();

        createStoreTesterForVisualizationScanResultActions(actionName).testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('onIssuesDisabled', () => {
        const expectedViolations: AxeRule[] = [
            {
                id: 'test id',
                description: 'test description',
                nodes: [
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['target1'],
                    },
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['target2'],
                    },
                ],
            },
        ];

        const expectedFullIdToResultMap = {
            id1: {
                all: [],
                any: [],
                failureSummary: 'failureSummary',
                html: 'html',
                none: [],
                ruleId: 'test id',
                status: false,
                selector: 'target1',
                id: 'id1',
            },
            id2: {
                all: [],
                any: [],
                failureSummary: 'failureSummary',
                html: 'html',
                none: [],
                ruleId: 'test id',
                status: false,
                selector: 'target2',
                id: 'id2',
            },
        };

        const selectorMap: DictionaryStringTo<HtmlElementAxeResults> = {
            target1: {
                target: ['target1'],
                ruleResults: {
                    'test id': {
                        any: [],
                        all: [],
                        none: [],
                        status: false,
                        ruleId: 'test id',
                        selector: 'target1',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help1',
                        id: 'id1',
                        guidanceLinks: [],
                        helpUrl: 'help1',
                    },
                },
            },
            target2: {
                target: ['target2'],
                ruleResults: {
                    'test id': {
                        any: [],
                        all: [],
                        none: [],
                        status: false,
                        ruleId: 'test id',
                        selector: 'target2',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help2',
                        id: 'id2',
                        guidanceLinks: [],
                        helpUrl: 'help2',
                    },
                },
            },
        };

        const scanResult: ScanResults = {
            passes: [],
            violations: expectedViolations,
        } as ScanResults;

        const visualizationType = VisualizationType.Issues;

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(visualizationType, selectorMap)
            .withFullIdToRuleResultMapForIssues(expectedFullIdToResultMap)
            .withScanResult(visualizationType, scanResult)
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(visualizationType, selectorMap)
            .withFullIdToRuleResultMapForIssues(expectedFullIdToResultMap)
            .build();

        createStoreTesterForVisualizationScanResultActions(
            'disableIssues',
        ).testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabStopDisabled', () => {
        const tabEvents: TabbedElementData[] = [
            {
                target: ['selector'],
                timestamp: 1,
                html: 'test',
                tabOrder: 1,
            },
        ];

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabEvents)
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(null)
            .build();

        createStoreTesterForVisualizationScanResultActions(
            'disableTabStop',
        ).testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanCompleted', () => {
        const visualizationType = VisualizationType.Issues;
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const expectedViolations: AxeRule[] = [
            {
                id: 'test id',
                description: 'test description',
                nodes: [
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['target1'],
                    },
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['target2'],
                    },
                ],
            },
        ];

        const expectedFullIdToResultMap = {
            id1: {
                all: [],
                any: [],
                failureSummary: 'failureSummary',
                html: 'html',
                none: [],
                ruleId: 'test id',
                status: false,
                selector: 'target1',
                help: 'help1',
                id: 'id1',
                guidanceLinks: [],
                helpUrl: 'help1',
            },
            id2: {
                all: [],
                any: [],
                failureSummary: 'failureSummary',
                html: 'html',
                none: [],
                ruleId: 'test id',
                status: false,
                selector: 'target2',
                help: 'help2',
                id: 'id2',
                guidanceLinks: [],
                helpUrl: 'help2',
            },
        };

        const selectorMap: DictionaryStringTo<HtmlElementAxeResults> = {
            target1: {
                target: ['target1'],
                ruleResults: {
                    'test id': {
                        any: [],
                        all: [],
                        none: [],
                        status: false,
                        ruleId: 'test id',
                        selector: 'target1',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help1',
                        id: 'id1',
                        guidanceLinks: [],
                        helpUrl: 'help1',
                    },
                },
            },
            target2: {
                target: ['target2'],
                ruleResults: {
                    'test id': {
                        any: [],
                        all: [],
                        none: [],
                        status: false,
                        ruleId: 'test id',
                        selector: 'target2',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help2',
                        id: 'id2',
                        guidanceLinks: [],
                        helpUrl: 'help2',
                    },
                },
            },
        };

        const scanResult: ScanResults = {
            passes: [],
            violations: expectedViolations,
        } as ScanResults;

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(visualizationType, selectorMap)
            .withFullIdToRuleResultMapForIssues(expectedFullIdToResultMap)
            .withScanResult(visualizationType, scanResult)
            .build();

        const payload = {
            selectorMap: selectorMap,
            scanResult: scanResult,
            key: 'issues',
        };

        createStoreTesterForVisualizationScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: first element', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const payload: AddTabbedElementPayload = {
            tabbedElements: [
                {
                    timestamp: 10,
                    html: 'test',
                    target: ['selector1'],
                },
            ],
        };

        const tabbedElements: TabbedElementData[] = [
            {
                timestamp: payload.tabbedElements[0].timestamp,
                target: payload.tabbedElements[0].target,
                html: 'test',
                tabOrder: 1,
            },
        ];

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabbedElements)
            .build();

        createStoreTesterForVisualizationScanResultActions('addTabbedElement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: ensure correct tab order', () => {
        const initialTabbedElements: TabbedElementData[] = [
            {
                timestamp: 10,
                target: ['selector-10'],
                html: 'test',
                tabOrder: 1,
            },
            {
                timestamp: 30,
                target: ['selector-30'],
                html: 'test',
                tabOrder: 2,
            },
        ];

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(initialTabbedElements)
            .build();

        const payload: AddTabbedElementPayload = {
            tabbedElements: [
                {
                    timestamp: 20,
                    html: 'test',
                    target: ['selector-20'],
                },
            ],
        };

        const expectedTabbedElements: TabbedElementData[] = [
            initialTabbedElements[0],
            {
                timestamp: payload.tabbedElements[0].timestamp,
                target: payload.tabbedElements[0].target,
                html: 'test',
                tabOrder: 2,
            },
            {
                target: initialTabbedElements[1].target,
                timestamp: initialTabbedElements[1].timestamp,
                html: 'test',
                tabOrder: 3,
            },
        ];

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(expectedTabbedElements)
            .build();

        createStoreTesterForVisualizationScanResultActions('addTabbedElement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onExistingTabUpdated', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withScanResult(VisualizationType.Headings, [])
            .withTabStopsTabbedElements([])
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder().build();

        createStoreTesterForTabActions('existingTabUpdated').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    function createStoreTesterForVisualizationScanResultActions(
        actionName: keyof VisualizationScanResultActions,
    ): StoreTester<VisualizationScanResultData, VisualizationScanResultActions> {
        const factory = (actions: VisualizationScanResultActions) =>
            new VisualizationScanResultStore(actions, new TabActions());

        return new StoreTester(VisualizationScanResultActions, actionName, factory);
    }

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<VisualizationScanResultData, TabActions> {
        const factory = (actions: TabActions) =>
            new VisualizationScanResultStore(new VisualizationScanResultActions(), actions);

        return new StoreTester(TabActions, actionName, factory);
    }
});
