// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabbedElementPayload,
    AddTabStopInstanceArrayPayload,
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from 'background/actions/action-payloads';
import { TabActions } from 'background/actions/tab-actions';
import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AdHocTestkeys } from 'common/types/store-data/adhoc-test-keys';
import { IMock, Mock } from 'typemoq';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    HtmlElementAxeResults,
    TabbedElementData,
    TabStopRequirementState,
    VisualizationScanResultData,
} from '../../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { ScanResults } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';

const generateUIDStub = () => 'abc';
describe('VisualizationScanResultStoreTest', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(VisualizationScanResultStore);

        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(VisualizationScanResultStore);

        expect(testObject.getId()).toBe(StoreNames[StoreNames.VisualizationScanResultStore]);
    });

    test('onGetCurrentState', async () => {
        const actionName = 'getCurrentState';

        const initialState = new VisualizationScanResultStoreDataBuilder().build();
        const finalState = new VisualizationScanResultStoreDataBuilder().build();

        const storeTester = createStoreTesterForVisualizationScanResultActions(actionName);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function getTabbedElementDataStub() {
        return [
            {
                target: ['selector'],
                timestamp: 1,
                html: 'test',
                tabOrder: 1,
                instanceId: 'some instance id',
            },
        ];
    }

    test('onTabStopDisabled', async () => {
        const tabEvents: TabbedElementData[] = getTabbedElementDataStub();

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabEvents)
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(null)
            .build();

        const storeTester = createStoreTesterForVisualizationScanResultActions('disableTabStop');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onRescanVisualization: for test that has state', async () => {
        const tabEvents: TabbedElementData[] = getTabbedElementDataStub();
        const testKey = AdHocTestkeys.TabStops;
        const visualizationTypeStub = -2;
        const configStub: VisualizationConfiguration = {
            key: testKey,
        } as VisualizationConfiguration;

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabEvents)
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder().build();

        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(visualizationTypeStub))
            .returns(() => configStub);

        const storeTester = createStoreTesterForVisualizationActions(
            'resetDataForVisualization',
        ).withActionParam(visualizationTypeStub);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onRescanVisualizationv: for test that does not have state', async () => {
        const tabEvents: TabbedElementData[] = getTabbedElementDataStub();
        const testKey = 'some test key';
        const visualizationTypeStub = -2;
        const configStub: VisualizationConfiguration = {
            key: testKey,
        } as VisualizationConfiguration;

        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabEvents)
            .build();

        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(visualizationTypeStub))
            .returns(() => configStub);

        const storeTester = createStoreTesterForVisualizationActions(
            'resetDataForVisualization',
        ).withActionParam(visualizationTypeStub);
        await storeTester.testListenerToNeverBeCalled(initialState, initialState);
    });

    test('onScanCompleted', async () => {
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

        const storeTester =
            createStoreTesterForVisualizationScanResultActions('scanCompleted').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: first element', async () => {
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
                instanceId: 'abc',
            },
        ];

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(tabbedElements)
            .build();

        const storeTester =
            createStoreTesterForVisualizationScanResultActions('addTabbedElement').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onAddTabbedElement: ensure correct tab order', async () => {
        const initialTabbedElements: TabbedElementData[] = [
            {
                timestamp: 10,
                target: ['selector-10'],
                html: 'test',
                tabOrder: 1,
                instanceId: 'some instance id',
            },
            {
                timestamp: 30,
                target: ['selector-30'],
                html: 'test',
                tabOrder: 2,
                instanceId: 'some other instance id',
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
                instanceId: 'abc',
            },
            {
                ...initialTabbedElements[1],
                tabOrder: 3,
            },
        ];

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopsTabbedElements(expectedTabbedElements)
            .build();

        const storeTester =
            createStoreTesterForVisualizationScanResultActions('addTabbedElement').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onExistingTabUpdated', async () => {
        const initialState = new VisualizationScanResultStoreDataBuilder()
            .withScanResult(VisualizationType.Headings, [])
            .withTabStopsTabbedElements([])
            .build();

        const expectedState = new VisualizationScanResultStoreDataBuilder().build();

        const storeTester = createStoreTesterForTabActions('existingTabUpdated');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onUpdateTabStopRequirementStatus updates status and removes instances', async () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();
        initialState.tabStops.requirements['keyboard-navigation'].status = 'fail';
        initialState.tabStops.requirements['keyboard-navigation'].instances = [
            { description: 'test1', id: 'abc' },
        ];

        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId: 'keyboard-navigation',
            status: 'pass',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'pass',
                instances: [],
                isExpanded: false,
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        const storeTester = createStoreTesterForTabStopRequirementActions(
            'updateTabStopsRequirementStatus',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetTabStopRequirementStatus resets status and removes instances', async () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();
        initialState.tabStops.requirements['keyboard-navigation'].status = 'fail';
        initialState.tabStops.requirements['keyboard-navigation'].instances = [
            { description: 'test1', id: 'abc' },
        ];

        const payload: ResetTabStopRequirementStatusPayload = {
            requirementId: 'keyboard-navigation',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [],
                isExpanded: false,
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();

        const storeTester = createStoreTesterForTabStopRequirementActions(
            'resetTabStopRequirementStatus',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    describe('onAddTabStopInstance', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const payload: AddTabStopInstancePayload = {
            requirementId: 'keyboard-navigation',
            description: 'test1',
            selector: ['some-selector'],
            html: 'some html',
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [
                    {
                        description: 'test1',
                        id: 'abc',
                        selector: ['some-selector'],
                        html: 'some html',
                    },
                ],
                isExpanded: false,
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();
        expectedState.tabStops.requirements[payload.requirementId].status = 'fail';

        test('adds tab stop failure instance', async () => {
            const storeTester =
                createStoreTesterForTabStopRequirementActions('addTabStopInstance').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onAddTabStopInstanceArray', () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const results: AddTabStopInstancePayload[] = [
            {
                requirementId: 'keyboard-navigation',
                description: 'test1',
                selector: ['some-selector'],
                html: 'some html',
            },
            {
                requirementId: 'focus-indicator',
                description: 'test2',
                selector: ['some-other-selector'],
                html: 'some other html',
            },
        ];
        const payload: AddTabStopInstanceArrayPayload = {
            results,
        };

        const requirement: TabStopRequirementState = {
            'keyboard-navigation': {
                status: 'unknown',
                instances: [
                    {
                        description: 'test1',
                        id: 'abc',
                        selector: ['some-selector'],
                        html: 'some html',
                    },
                ],
                isExpanded: false,
            },
            'focus-indicator': {
                status: 'unknown',
                instances: [
                    {
                        description: 'test2',
                        id: 'abc',
                        selector: ['some-other-selector'],
                        html: 'some other html',
                    },
                ],
                isExpanded: false,
            },
        };

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabStopRequirement(requirement)
            .build();
        expectedState.tabStops.requirements[results[0].requirementId].status = 'fail';
        expectedState.tabStops.requirements[results[1].requirementId].status = 'fail';

        test('adds tab stop failure instance', async () => {
            const storeTester =
                createStoreTesterForTabStopRequirementActions(
                    'addTabStopInstanceArray',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    test('onUpdateTabStopInstance', async () => {
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
                isExpanded: false,
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

        const storeTester =
            createStoreTesterForTabStopRequirementActions('updateTabStopInstance').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onRemoveTabStopInstance', async () => {
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
                isExpanded: false,
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

        const storeTester =
            createStoreTesterForTabStopRequirementActions('removeTabStopInstance').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onUpdateTabbingCompleted', async () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withTabbingCompleted(true)
            .build();

        const payload: UpdateTabbingCompletedPayload = {
            tabbingCompleted: true,
        };

        const storeTester =
            createStoreTesterForTabStopRequirementActions('updateTabbingCompleted').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onUpdateNeedToCollectTabbingResults', async () => {
        const initialState = new VisualizationScanResultStoreDataBuilder().build();

        const expectedState = new VisualizationScanResultStoreDataBuilder()
            .withNeedToCollectTabbingResults(true)
            .build();

        const payload: UpdateNeedToCollectTabbingResultsPayload = {
            needToCollectTabbingResults: true,
        };

        const storeTester = createStoreTesterForTabStopRequirementActions(
            'updateNeedToCollectTabbingResults',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test.each([true, false])(
        'toggleTabStopRequirementExpand with initial state isExpanded=%s',
        async isInitiallyExpanded => {
            const requirementId = 'keyboard-navigation';
            const requirement: TabStopRequirementState = {
                [requirementId]: {
                    status: 'unknown',
                    instances: [{ description: 'test1', id: 'abc' }],
                    isExpanded: isInitiallyExpanded,
                },
            };
            const initialState = new VisualizationScanResultStoreDataBuilder()
                .withTabStopRequirement(requirement)
                .build();

            const expectedState = new VisualizationScanResultStoreDataBuilder()
                .withTabStopRequirement({
                    [requirementId]: {
                        ...requirement[requirementId],
                        isExpanded: !isInitiallyExpanded,
                    },
                })
                .build();

            const storeTester = createStoreTesterForTabStopRequirementActions(
                'toggleTabStopRequirementExpand',
            ).withActionParam({ requirementId });
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        },
    );

    function createStoreTesterForVisualizationScanResultActions(
        actionName: keyof VisualizationScanResultActions,
    ): StoreTester<VisualizationScanResultData, VisualizationScanResultActions> {
        const factory = (actions: VisualizationScanResultActions) =>
            new VisualizationScanResultStore(
                actions,
                new TabActions(),
                new TabStopRequirementActions(),
                new VisualizationActions(),
                generateUIDStub,
                visualizationConfigurationFactoryMock.object,
                null,
                null,
                null,
                null,
                true,
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
                new VisualizationActions(),
                generateUIDStub,
                visualizationConfigurationFactoryMock.object,
                null,
                null,
                null,
                null,
                true,
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
                new VisualizationActions(),
                generateUIDStub,
                visualizationConfigurationFactoryMock.object,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(TabStopRequirementActions, actionName, factory);
    }

    function createStoreTesterForVisualizationActions(
        actionName: keyof VisualizationActions,
    ): StoreTester<VisualizationScanResultData, VisualizationActions> {
        const factory = (actions: VisualizationActions) =>
            new VisualizationScanResultStore(
                new VisualizationScanResultActions(),
                new TabActions(),
                new TabStopRequirementActions(),
                actions,
                generateUIDStub,
                visualizationConfigurationFactoryMock.object,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(VisualizationActions, actionName, factory);
    }
});
