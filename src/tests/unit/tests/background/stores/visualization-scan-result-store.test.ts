// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabbedElementPayload,
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from 'background/actions/action-payloads';
import { TabActions } from 'background/actions/tab-actions';
import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    TabbedElementData,
    TabStopRequirementState,
    VisualizationScanResultData,
} from '../../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ScanResults } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';
const generateUIDStub = () => 'abc';
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

    test('onUpdateTabStopRequirementStatus', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId: 'keyboard-navigation',
            status: 'pass',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'pass',
                instances: [],
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        createStoreTesterForTabStopRequirementActions('updateTabStopsRequirementStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabStopInstance', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const payload: AddTabStopInstancePayload = {
            requirementId: 'keyboard-navigation',
            description: 'test1',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [{ description: 'test1', id: 'abc' }],
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        createStoreTesterForTabStopRequirementActions('addTabStopInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onUpdateTabStopInstance', () => {
        const payload: UpdateTabStopInstancePayload = {
            requirementId: 'keyboard-navigation',
            id: 'xyz',
            description: 'test2',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [
                    { description: 'test1', id: 'abc' },
                    { description: 'test3', id: 'xyz' },
                ],
            },
        };

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        requirement['keyboard-navigation'].instances.find(
            instance => instance.id === 'xyz',
        ).description = 'test2';

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        createStoreTesterForTabStopRequirementActions('addTabStopInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onRemoveTabStopInstance', () => {
        const payload: RemoveTabStopInstancePayload = {
            requirementId: 'keyboard-navigation',
            id: 'abc',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [
                    { description: 'test1', id: 'abc' },
                    { description: 'test3', id: 'xyz' },
                ],
            },
        };

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        const newInstances = [{ description: 'test3', id: 'xyz' }];
        requirement['keyboard-navigation'].instances = newInstances;

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        createStoreTesterForTabStopRequirementActions('addTabStopInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForVisualizationScanResultActions(
        actionName: keyof VisualizationScanResultActions,
    ): StoreTester<VisualizationScanResultData, VisualizationScanResultActions> {
        const factory = (actions: VisualizationScanResultActions) =>
            new VisualizationScanResultStore(
                actions,
                new TabActions(),
                new TabStopRequirementActions(),
                generateUIDStub,
            );

        return new StoreTester(VisualizationScanResultActions, actionName, factory);
    }

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<VisualizationScanResultData, TabActions> {
        const factory = (actions: TabActions) =>
            new VisualizationScanResultStore(
                new VisualizationScanResultActions(),
                actions,
                new TabStopRequirementActions(),
                generateUIDStub,
            );

        return new StoreTester(TabActions, actionName, factory);
    }

    function createStoreTesterForTabStopRequirementActions(
        actionName: keyof TabStopRequirementActions,
    ): StoreTester<VisualizationScanResultData, TabStopRequirementActions> {
        const factory = (actions: TabStopRequirementActions) =>
            new VisualizationScanResultStore(
                new VisualizationScanResultActions(),
                new TabActions(),
                actions,
                generateUIDStub,
            );

        return new StoreTester(TabStopRequirementActions, actionName, factory);
    }
});
