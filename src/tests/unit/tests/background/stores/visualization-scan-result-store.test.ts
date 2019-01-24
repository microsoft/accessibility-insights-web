// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAddTabbedElementPayload } from '../../../../../background/actions/action-payloads';
import { TabActions } from '../../../../../background/actions/tab-actions';
import { VisualizationScanResultActions } from '../../../../../background/actions/visualization-scan-result-actions';
import { VisualizationScanResultStore } from '../../../../../background/stores/visualization-scan-result-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { ITabbedElementData } from '../../../../../common/types/store-data/ivisualization-scan-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { IHtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ScanResults } from '../../../../../scanner/iruleresults';
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

        createStoreTesterForVisualizationScanResultActions(actionName).testListenerToBeCalledOnce(initialState, finalState);
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

        const selectorMap: IDictionaryStringTo<IHtmlElementAxeResults> = {
            target1: {
                target: ['target1'],
                isVisible: true,
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
                        fingerprint: 'fp1',
                        snippet: 'html',
                    },
                },
            },
            target2: {
                target: ['target2'],
                isVisible: true,
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
                        fingerprint: 'fp2',
                        snippet: 'html',
                    },
                },
            },
        };

        const scanResult: ScanResults = {
            passes: [],
            violations: expectedViolations,
        } as ScanResults;

        const type = VisualizationType.Issues;

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(type, selectorMap)
            .withFullIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withSelectedIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withScanResult(type, scanResult)
            .withIssuesSelectedTargets(selectorMap)
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(type, selectorMap)
            .withFullIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withSelectedIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withIssuesSelectedTargets(selectorMap)
            .build();

        createStoreTesterForVisualizationScanResultActions('disableIssues').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabStopDisabled', () => {
        const tabEvents: ITabbedElementData[] = [
            {
                target: ['selector'],
                timestamp: 1,
                html: 'test',
                tabOrder: 1,
            },
        ];

        const initialState = new VisualizationScanResultStoreDataBuilder().withTabStopsTabbedElements(tabEvents).build();

        const expectedState = new VisualizationScanResultStoreDataBuilder().withTabStopsTabbedElements(null).build();

        createStoreTesterForVisualizationScanResultActions('disableTabStop').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanCompleted', () => {
        const type = VisualizationType.Issues;
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
                fingerprint: 'fp1',
                snippet: 'html',
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
                fingerprint: 'fp2',
                snippet: 'html',
            },
        };

        const selectorMap: IDictionaryStringTo<IHtmlElementAxeResults> = {
            target1: {
                target: ['target1'],
                isVisible: true,
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
                        fingerprint: 'fp1',
                        snippet: 'html',
                    },
                },
            },
            target2: {
                target: ['target2'],
                isVisible: true,
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
                        fingerprint: 'fp2',
                        snippet: 'html',
                    },
                },
            },
        };

        const scanResult: ScanResults = {
            passes: [],
            violations: expectedViolations,
        } as ScanResults;

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(type, selectorMap)
            .withFullIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withSelectedIdToRuleResultMap(type, expectedFullIdToResultMap)
            .withScanResult(type, scanResult)
            .withIssuesSelectedTargets(selectorMap)
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

    test('onUpdateIssuesSelectedTargets', () => {
        const actionName = 'updateIssuesSelectedTargets';

        const selectorMap: IDictionaryStringTo<IHtmlElementAxeResults> = {
            '#heading-1': {
                ruleResults: {
                    rule1: {
                        any: [],
                        none: [],
                        all: [],
                        status: false,
                        ruleId: 'rule1',
                        selector: '#heading-1',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help1',
                        id: 'id1',
                        guidanceLinks: [],
                        helpUrl: 'help1',
                        fingerprint: 'fp1',
                        snippet: 'html',
                    },
                },
                target: ['#heading-1'],
                isVisible: true,
            },
            '#heading-2': {
                ruleResults: {
                    rule2: {
                        any: [],
                        none: [],
                        all: [],
                        status: false,
                        ruleId: 'rule2',
                        selector: '#heading-2',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help2',
                        id: 'id2',
                        guidanceLinks: [],
                        helpUrl: 'help2',
                        fingerprint: 'fp2',
                        snippet: 'html',
                    },
                },
                target: ['#heading-2'],
                isVisible: true,
            },
        };

        const expectedFullIdToRuleResultMap = {
            id1: {
                any: [],
                none: [],
                all: [],
                status: false,
                ruleId: 'rule1',
                selector: '#heading-1',
                html: 'html',
                failureSummary: 'failureSummary',
                help: 'help1',
                id: 'id1',
                guidanceLinks: [],
                helpUrl: 'help1',
                fingerprint: 'fp1',
                snippet: 'html',
            },
            id2: {
                any: [],
                none: [],
                all: [],
                status: false,
                ruleId: 'rule2',
                selector: '#heading-2',
                html: 'html',
                failureSummary: 'failureSummary',
                help: 'help2',
                id: 'id2',
                guidanceLinks: [],
                helpUrl: 'help2',
                fingerprint: 'fp2',
                snippet: 'html',
            },
        };

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(VisualizationType.Issues, selectorMap)
            .withFullIdToRuleResultMap(VisualizationType.Issues, expectedFullIdToRuleResultMap)
            .withSelectedIdToRuleResultMap(VisualizationType.Issues, expectedFullIdToRuleResultMap)
            .withIssuesSelectedTargets(selectorMap)
            .build();

        const expectedSelectedMap: IDictionaryStringTo<IHtmlElementAxeResults> = {
            '#heading-1': {
                ruleResults: {
                    rule1: {
                        any: [],
                        none: [],
                        all: [],
                        status: false,
                        ruleId: 'rule1',
                        selector: '#heading-1',
                        id: 'id1',
                        html: 'html',
                        failureSummary: 'failureSummary',
                        help: 'help1',
                        guidanceLinks: [],
                        helpUrl: 'help1',
                        fingerprint: 'fp1',
                        snippet: 'html',
                    },
                },
                target: ['#heading-1'],
                isVisible: null,
            },
        };

        const expectedSelectedIdToRuleResultMap = {
            id1: {
                any: [],
                none: [],
                all: [],
                status: false,
                ruleId: 'rule1',
                selector: '#heading-1',
                html: 'html',
                failureSummary: 'failureSummary',
                help: 'help1',
                id: 'id1',
                guidanceLinks: [],
                helpUrl: 'help1',
                fingerprint: 'fp1',
                snippet: 'html',
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withSelectorMap(VisualizationType.Issues, selectorMap)
            .withFullIdToRuleResultMap(VisualizationType.Issues, expectedFullIdToRuleResultMap)
            .withSelectedIdToRuleResultMap(VisualizationType.Issues, expectedSelectedIdToRuleResultMap)
            .withIssuesSelectedTargets(expectedSelectedMap)
            .build();

        createStoreTesterForVisualizationScanResultActions(actionName)
            .withActionParam(['id1', 'not-a-real-id'])
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: first element', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const payload: IAddTabbedElementPayload = {
            tabbedElements: [
                {
                    timestamp: 10,
                    html: 'test',
                    target: ['selector1'],
                },
            ],
        };

        const tabbedElements: ITabbedElementData[] = [
            {
                timestamp: payload.tabbedElements[0].timestamp,
                target: payload.tabbedElements[0].target,
                html: 'test',
                tabOrder: 1,
            },
        ];

        const expectedState = new VisualizationScanResultStoreDataBuilder().withTabStopsTabbedElements(tabbedElements).build();

        createStoreTesterForVisualizationScanResultActions('addTabbedElement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: ensure correct tab order', () => {
        const initialTabbedElements: ITabbedElementData[] = [
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

        const initialState = new VisualizationScanResultStoreDataBuilder().withTabStopsTabbedElements(initialTabbedElements).build();

        const payload: IAddTabbedElementPayload = {
            tabbedElements: [
                {
                    timestamp: 20,
                    html: 'test',
                    target: ['selector-20'],
                },
            ],
        };

        const expectedTabbedElements: ITabbedElementData[] = [
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

        const expectedState = new VisualizationScanResultStoreDataBuilder().withTabStopsTabbedElements(expectedTabbedElements).build();

        createStoreTesterForVisualizationScanResultActions('addTabbedElement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabChange', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withFullIdToRuleResultMap(VisualizationType.Color, {})
            .withIssuesSelectedTargets({})
            .withScanResult(VisualizationType.Headings, [])
            .withSelectedIdToRuleResultMap(VisualizationType.Landmarks, {})
            .withTabStopsTabbedElements([])
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder().build();

        createStoreTesterForTabActions('tabChange').testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForVisualizationScanResultActions(actionName: keyof VisualizationScanResultActions) {
        const factory = (actions: VisualizationScanResultActions) => new VisualizationScanResultStore(actions, new TabActions());

        return new StoreTester(VisualizationScanResultActions, actionName, factory);
    }

    function createStoreTesterForTabActions(actionName: keyof TabActions) {
        const factory = (actions: TabActions) => new VisualizationScanResultStore(new VisualizationScanResultActions(), actions);

        return new StoreTester(TabActions, actionName, factory);
    }
});
