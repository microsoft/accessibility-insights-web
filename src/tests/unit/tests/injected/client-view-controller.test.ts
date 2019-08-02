// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentDataConverter } from 'background/assessment-data-converter';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { BaseStore } from '../../../../common/base-store';
import { TestMode } from '../../../../common/configs/test-mode';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../common/enum-helper';
import { getDefaultFeatureFlagValues } from '../../../../common/feature-flags';
import { AssessmentStoreData } from '../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../../../common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from '../../../../common/types/store-data/visualization-scan-result-data';
import { ScanData, VisualizationStoreData } from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { ClientViewController } from '../../../../injected/client-view-controller';
import { DrawingInitiator } from '../../../../injected/drawing-initiator';
import { AssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { ScrollingController, ScrollingWindowMessage } from '../../../../injected/frameCommunicators/scrolling-controller';
import { SelectorMapHelper } from '../../../../injected/selector-map-helper';
import { TargetPageActionMessageCreator } from '../../../../injected/target-page-action-message-creator';
import { PropertyBags, VisualizationInstanceProcessorCallback } from '../../../../injected/visualization-instance-processor';
import { DictionaryNumberTo, DictionaryStringTo } from '../../../../types/common-types';
import { AssessmentsStoreDataBuilder } from '../../common/assessment-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { UserConfigurationStore } from './../../../../background/stores/global/user-configuration-store';
import { UserConfigurationStoreData } from './../../../../common/types/store-data/user-configuration-store';

describe('ClientViewControllerTest', () => {
    test('initialize', () => {
        let privateListenerVisStore;
        let privateListenerVisScanStore;
        let privateListenerAssessmentStore;

        const visualizationStore = Mock.ofType(VisualizationStore, MockBehavior.Strict);
        const visualizationScanResultStoreMock = Mock.ofType(VisualizationScanResultStore, MockBehavior.Strict);
        const assessmentStoreMock = Mock.ofType<BaseStore<AssessmentStoreData>>(null, MockBehavior.Strict);
        const tabStoreMock = Mock.ofType<BaseStore<TabStoreData>>(TabStore, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(UserConfigurationStore, MockBehavior.Strict);
        const featureFlagStoreMock = Mock.ofType(FeatureFlagStore);

        visualizationStore
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerVisStore = listener;
            })
            .verifiable(Times.once());
        visualizationScanResultStoreMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerVisScanStore = listener;
            })
            .verifiable(Times.once());
        assessmentStoreMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerAssessmentStore = listener;
            })
            .verifiable(Times.once());
        tabStoreMock.setup(sm => sm.addChangedListener(It.isAny())).verifiable(Times.once());
        userConfigStoreMock.setup(sm => sm.addChangedListener(It.isAny())).verifiable(Times.once());

        const testObject = new ClientViewController(
            visualizationStore.object,
            visualizationScanResultStoreMock.object,
            null,
            null,
            null,
            featureFlagStoreMock.object,
            assessmentStoreMock.object,
            tabStoreMock.object,
            userConfigStoreMock.object,
            null,
            null,
        );
        testObject.initialize();

        visualizationStore.verifyAll();
        visualizationScanResultStoreMock.verifyAll();
        assessmentStoreMock.verifyAll();
        userConfigStoreMock.verifyAll();
        expect(privateListenerVisStore).toEqual(testObject.onChangedState);
        expect(privateListenerVisScanStore).toEqual(testObject.onChangedState);
        expect(privateListenerAssessmentStore).toEqual(testObject.onChangedState);
    });

    test('onChangedState: currently scanning', () => {
        const builder = new MocksAndTestSubjectBuilder().setScanning('headings');

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: one or more store is null', () => {
        const builder = new MocksAndTestSubjectBuilder().fromFeatureFlagState(null);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling headings when headings is disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Headings).toEnabled(VisualizationType.Headings);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling headings when headings is already enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Headings).toEnabled(VisualizationType.Headings);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling headings when headings is enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Headings).toDisabled(VisualizationType.Headings);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling headings when headings is already disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Headings).toDisabled(VisualizationType.Headings);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling landmarks when landmarks is disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Landmarks).toEnabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling landmarks when landmarks is already enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Landmarks).toEnabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling landmarks when landmarks is enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Landmarks).toDisabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling landmarks when landmarks is already disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Landmarks).toDisabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling color when color is disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Color).toEnabled(VisualizationType.Color);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enablings color when color is already enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Color).toEnabled(VisualizationType.Color);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling color when color is enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Color).toDisabled(VisualizationType.Color);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling color when color is already disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Color).toDisabled(VisualizationType.Color);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enabling issues when issues is disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Issues).toEnabled(VisualizationType.Issues);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: enablings issues when issues is already enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Issues).toEnabled(VisualizationType.Issues);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling issues when issues is enabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromEnabled(VisualizationType.Issues).toDisabled(VisualizationType.Issues);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling issues when issues is already disabled', () => {
        const builder = new MocksAndTestSubjectBuilder().fromDisabled(VisualizationType.Issues).toDisabled(VisualizationType.Issues);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: from disable to enable for headings and issues at the same time', () => {
        const builder = new MocksAndTestSubjectBuilder()
            .fromDisabled(VisualizationType.Headings)
            .toEnabled(VisualizationType.Headings)
            .fromDisabled(VisualizationType.Issues)
            .toEnabled(VisualizationType.Issues);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: focusedInstance changed', () => {
        const selector = ['a', 'b', 'c'];
        const message: ScrollingWindowMessage = {
            focusedTarget: selector,
        };
        const builder = new MocksAndTestSubjectBuilder()
            .fromFocusedTarget(['a'])
            .ToFocusedTarget(selector)
            .setupScrolling(Times.once(), message);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: from enable to disable for issues and landmarks at the same time', () => {
        const builder = new MocksAndTestSubjectBuilder()
            .fromEnabled(VisualizationType.Issues)
            .toDisabled(VisualizationType.Issues)
            .fromEnabled(VisualizationType.Landmarks)
            .toDisabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: headings, issues and landmarks changing at the same time', () => {
        const builder = new MocksAndTestSubjectBuilder()
            .fromEnabled(VisualizationType.Headings)
            .toDisabled(VisualizationType.Headings)
            .fromDisabled(VisualizationType.Issues)
            .toDisabled(VisualizationType.Issues)
            .fromEnabled(VisualizationType.Landmarks)
            .toEnabled(VisualizationType.Landmarks);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: headings, issues landmarks and color changing at the same time', () => {
        const builder = new MocksAndTestSubjectBuilder()
            .fromEnabled(VisualizationType.Headings)
            .toDisabled(VisualizationType.Headings)
            .fromDisabled(VisualizationType.Issues)
            .toDisabled(VisualizationType.Issues)
            .fromEnabled(VisualizationType.Landmarks)
            .toEnabled(VisualizationType.Landmarks)
            .fromEnabled(VisualizationType.Color)
            .toEnabled(VisualizationType.Color);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: focusedInstance changed', () => {
        const selector = ['a', 'b', 'c'];
        const message: ScrollingWindowMessage = {
            focusedTarget: selector,
        };
        const builder = new MocksAndTestSubjectBuilder()
            .fromFocusedTarget(['a'])
            .ToFocusedTarget(selector)
            .setupScrolling(Times.once(), message);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });

    test('onChangedState: disabling headingsAssessment when target has changed', () => {
        const builder = new MocksAndTestSubjectBuilder()
            .fromDisabled(VisualizationType.HeadingsAssessment)
            .toDisabled(VisualizationType.HeadingsAssessment)
            .fromAssessmentTarget(1)
            .toAssessmentTarget(2);

        const testSubject = builder.build();
        testSubject.onChangedState();

        builder.verifyAll();
    });
});

class TestableClientViewController extends ClientViewController {
    public setPreviousVisualizationStatesStub(stub: DictionaryStringTo<boolean>): void {
        this.previousVisualizationStates = stub;
    }

    public setPreviousVisualizationSelectorMapStatesStub(
        stub: DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>>,
    ): void {
        this.previousVisualizationSelectorMapStates = stub;
    }
}

class MocksAndTestSubjectBuilder {
    private fromVisualizationStoreState: VisualizationStoreData;
    private toVisualizationStoreState: VisualizationStoreData;
    private fromVisualizationScanStoreState: VisualizationScanResultData;
    private toVisualizationScanStoreState: VisualizationScanResultData;
    private fromAssessmentStoreState: AssessmentStoreData;
    private toAssessmentStoreState: AssessmentStoreData;
    private fromTabStoreState: TabStoreData;
    private toTabStoreState: TabStoreData;
    private fromUserConfigurationStoreState: UserConfigurationStoreData;
    private toUserConfigurationStoreState: UserConfigurationStoreData;
    private fromTargetTabId: number;
    private toTargetTabId: number;

    private fromFeatureFlagStoreState: FeatureFlagStoreData = getDefaultFeatureFlagValues();
    private toFeatureFlagStoreState: FeatureFlagStoreData = getDefaultFeatureFlagValues();
    private visualizationStore: IMock<BaseStore<VisualizationStoreData>>;
    private assessmentStoreMock: IMock<BaseStore<AssessmentStoreData>>;
    private tabStoreMock: IMock<BaseStore<TabStoreData>>;
    private userConfigStoreMock: IMock<BaseStore<UserConfigurationStoreData>>;
    private selectorMapHelperMock: IMock<SelectorMapHelper>;
    private visualizationScanResultStoreMock: IMock<BaseStore<VisualizationScanResultData>>;
    private featureFlagStoreMock: IMock<BaseStore<DictionaryStringTo<boolean>>>;
    private drawingInitiatorMock: IMock<DrawingInitiator>;
    private scrollingControllerMock: IMock<ScrollingController>;
    private dataBuilderForFromVisualizationStoreState: VisualizationStoreDataBuilder = new VisualizationStoreDataBuilder();
    private dataBuilderForToVisualizationStoreState: VisualizationStoreDataBuilder = new VisualizationStoreDataBuilder();
    private dataBuilderForFromVisualizationScanStoreState = new VisualizationScanResultStoreDataBuilder();
    private dataBuilderForToVisualizationScanStoreState = new VisualizationScanResultStoreDataBuilder();
    private isScrollingInitiatorSetup: boolean = false;
    private initializedVisualizationState: DictionaryStringTo<boolean> = {};
    private initializedVisualizationSelectorMapState: DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>> = {};
    private selectorMap: DictionaryStringTo<AssessmentVisualizationInstance>;
    private visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    private actualVisualizationConfigurationFactory: VisualizationConfigurationFactory;
    private visualizationInstanceProcessorStub: VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>;
    private getVisualizationInstanceProcessorMock: IMock<
        (testStep?: string) => VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>
    >;
    private targetPageActionMessageCreatorMock: IMock<TargetPageActionMessageCreator>;

    public setScanning(id: string): MocksAndTestSubjectBuilder {
        this.dataBuilderForToVisualizationStoreState.with('scanning', id);
        return this;
    }

    public toDisabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this.dataBuilderForToVisualizationStoreState.withDisable(visualizationType);
        return this;
    }

    public toEnabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this.dataBuilderForToVisualizationStoreState.withEnable(visualizationType);
        return this;
    }

    public fromDisabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this.dataBuilderForFromVisualizationStoreState.withDisable(visualizationType);
        return this;
    }

    public fromEnabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this.dataBuilderForFromVisualizationStoreState.withEnable(visualizationType);
        return this;
    }

    public fromAssessmentTarget(id: number): MocksAndTestSubjectBuilder {
        this.fromTargetTabId = id;
        return this;
    }

    public toAssessmentTarget(id: number): MocksAndTestSubjectBuilder {
        this.toTargetTabId = id;
        return this;
    }

    public fromFocusedTarget(target: string[]): MocksAndTestSubjectBuilder {
        this.dataBuilderForFromVisualizationStoreState.withFocusedTarget(target);
        return this;
    }

    public ToFocusedTarget(target: string[]): MocksAndTestSubjectBuilder {
        this.dataBuilderForToVisualizationStoreState.withFocusedTarget(target);
        return this;
    }

    public setFullIdToRuleResultMap(map): MocksAndTestSubjectBuilder {
        this.dataBuilderForToVisualizationScanStoreState.withFullIdToRuleResultMapForIssues(map);
        return this;
    }

    public fromFeatureFlagState(state: FeatureFlagStoreData): MocksAndTestSubjectBuilder {
        this.fromFeatureFlagStoreState = state;
        return this;
    }

    public setupScrolling(times: Times, message: ScrollingWindowMessage): MocksAndTestSubjectBuilder {
        this.scrollingControllerMock = Mock.ofType(ScrollingController);
        this.scrollingControllerMock.setup(s => s.processRequest(It.isValue(message))).verifiable(times);
        this.isScrollingInitiatorSetup = true;

        this.targetPageActionMessageCreatorMock = Mock.ofType(TargetPageActionMessageCreator);
        this.targetPageActionMessageCreatorMock.setup(m => m.scrollRequested()).verifiable(times);

        return this;
    }

    public build(): ClientViewController {
        this.setupStatesAndSelectorMap();
        this.setupGetStateMock();
        this.setupDrawingControllerAndSelectorMapMock();
        this.setupScrollingControllerMock();
        this.setupTargetActionCreatorMock();
        this.buildPreviousStateStub();
        this.buildPreviousSelectorMapStatesStub();

        const controller = new TestableClientViewController(
            this.visualizationStore.object,
            this.visualizationScanResultStoreMock.object,
            this.drawingInitiatorMock.object,
            this.scrollingControllerMock.object,
            this.visualizationConfigurationFactoryMock.object,
            this.featureFlagStoreMock.object,
            this.assessmentStoreMock.object,
            this.tabStoreMock.object,
            this.userConfigStoreMock.object,
            this.selectorMapHelperMock.object,
            this.targetPageActionMessageCreatorMock.object,
        );

        (controller as any).currentVisualizationState = this.visualizationStore.object.getState();
        (controller as any).currentScanResultState = this.visualizationScanResultStoreMock.object.getState();
        (controller as any).currentAssessmentState = this.assessmentStoreMock.object.getState();
        (controller as any).currentTabState = this.tabStoreMock.object.getState();
        (controller as any).currentUserConfigStoreState = this.userConfigStoreMock.object.getState();

        controller.setPreviousVisualizationStatesStub(this.initializedVisualizationState);
        controller.setPreviousVisualizationSelectorMapStatesStub(this.initializedVisualizationSelectorMapState);
        this.actualVisualizationConfigurationFactory = new VisualizationConfigurationFactory();

        return controller;
    }

    public verifyAll(): void {
        this.drawingInitiatorMock.verifyAll();
        this.visualizationStore.verifyAll();
        if (this.isScrollingInitiatorSetup) {
            this.scrollingControllerMock.verifyAll();
            this.targetPageActionMessageCreatorMock.verifyAll();
        }
    }

    private setupDrawingControllerAndSelectorMapMock(): void {
        this.drawingInitiatorMock = Mock.ofType(DrawingInitiator);
        this.selectorMapHelperMock = Mock.ofType(SelectorMapHelper);
        this.setupVisualizationMocks();
    }

    private buildPreviousStateStub(): void {
        const factory = new VisualizationConfigurationFactory();
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => {
            const config = factory.getConfiguration(visualizationType);
            if (config.testMode === TestMode.Adhoc) {
                const id = config.getIdentifier();
                this.initializedVisualizationState[id] = this.getFromStateForType(visualizationType)
                    ? this.getFromStateForType(visualizationType).enabled
                    : false;
            }
        });
    }

    private buildPreviousSelectorMapStatesStub(): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => (this.initializedVisualizationSelectorMapState[visualizationType] = this.selectorMap));
    }

    private setupScrollingControllerMock(): void {
        this.scrollingControllerMock = this.scrollingControllerMock || Mock.ofType(ScrollingController);
    }

    private setupTargetActionCreatorMock(): void {
        this.targetPageActionMessageCreatorMock = this.targetPageActionMessageCreatorMock || Mock.ofType(TargetPageActionMessageCreator);
    }

    private setupVisualizationMocks(): void {
        this.setupEnableDisableVisualizationMock(VisualizationType.Headings);
        this.setupEnableDisableVisualizationMock(VisualizationType.Landmarks);
        this.setupEnableDisableVisualizationMock(VisualizationType.Issues);
    }

    private setupStatesAndSelectorMap(): void {
        const assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentsProviderMock.setup(ap => ap.all()).returns(() => []);
        const assessmentDataConverterMock = Mock.ofType(AssessmentDataConverter);
        assessmentDataConverterMock.setup(acdm => acdm.getNewManualTestStepResult(It.isAny())).returns(() => null);
        this.fromVisualizationStoreState = this.dataBuilderForFromVisualizationStoreState.build();
        this.toVisualizationStoreState = this.dataBuilderForToVisualizationStoreState.build();
        this.fromVisualizationScanStoreState = this.dataBuilderForFromVisualizationScanStoreState.build();
        this.toVisualizationScanStoreState = this.dataBuilderForToVisualizationScanStoreState.build();
        this.fromAssessmentStoreState = new AssessmentsStoreDataBuilder(assessmentsProviderMock.object, assessmentDataConverterMock.object)
            .withTargetTab(this.fromTargetTabId, null, null, false)
            .build();
        this.toAssessmentStoreState = new AssessmentsStoreDataBuilder(assessmentsProviderMock.object, assessmentDataConverterMock.object)
            .withTargetTab(this.toTargetTabId, null, null, false)
            .build();
        this.fromTabStoreState = { id: 1 } as TabStoreData;
        this.toTabStoreState = { id: 1 } as TabStoreData;
        this.fromUserConfigurationStoreState = {} as UserConfigurationStoreData;
        this.toUserConfigurationStoreState = {} as UserConfigurationStoreData;

        this.selectorMap = {
            key1: {
                target: ['element1'],
                html: 'test',
                isVisible: true,
                isFailure: true,
                isVisualizationEnabled: true,
                ruleResults: null,
                identifier: 'some id',
            },
            key2: {
                target: ['element2'],
                html: 'test',
                isVisible: true,
                isFailure: true,
                isVisualizationEnabled: true,
                ruleResults: null,
                identifier: 'some id',
            },
        };
    }

    private setupGetStateMock(): void {
        this.visualizationStore = Mock.ofType(VisualizationStore);
        this.assessmentStoreMock = Mock.ofType<BaseStore<AssessmentStoreData>>();
        this.tabStoreMock = Mock.ofType<BaseStore<TabStoreData>>(TabStore);
        this.userConfigStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(UserConfigurationStore);
        this.visualizationScanResultStoreMock = Mock.ofType(VisualizationScanResultStore);
        this.featureFlagStoreMock = Mock.ofType(FeatureFlagStore);

        this.visualizationStore.setup(sm => sm.getState()).returns(() => this.fromVisualizationStoreState);

        this.visualizationStore.setup(sm => sm.getState()).returns(() => this.toVisualizationStoreState);

        this.visualizationScanResultStoreMock.setup(sm => sm.getState()).returns(() => this.fromVisualizationScanStoreState);

        this.visualizationScanResultStoreMock.setup(sm => sm.getState()).returns(() => this.toVisualizationScanStoreState);

        this.assessmentStoreMock.setup(sm => sm.getState()).returns(() => this.fromAssessmentStoreState);

        this.assessmentStoreMock.setup(sm => sm.getState()).returns(() => this.toAssessmentStoreState);

        this.tabStoreMock
            .setup(sm => sm.getState())
            .returns(() => this.fromTabStoreState)
            .verifiable();

        this.userConfigStoreMock.setup(sm => sm.getState()).returns(() => this.fromUserConfigurationStoreState);

        this.userConfigStoreMock.setup(sm => sm.getState()).returns(() => this.toUserConfigurationStoreState);

        this.tabStoreMock.setup(sm => sm.getState()).returns(() => this.toTabStoreState);

        this.featureFlagStoreMock.setup(sm => sm.getState()).returns(() => this.fromFeatureFlagStoreState);

        this.featureFlagStoreMock.setup(sm => sm.getState()).returns(() => this.toFeatureFlagStoreState);
    }

    private setupEnableDisableVisualizationMock(visualizationType: VisualizationType): void {
        let enableTimes: Times;
        let disableTimes: Times;

        const toStateForType = this.getToStateForType(visualizationType);
        const fromStateForType = this.getFromStateForType(visualizationType);

        if (toStateForType.enabled === fromStateForType.enabled) {
            enableTimes = Times.never();
            disableTimes = Times.never();
        } else if (toStateForType.enabled) {
            enableTimes = Times.once();
            disableTimes = Times.never();
        } else {
            enableTimes = Times.never();
            disableTimes = Times.once();
        }

        if (this.toVisualizationStoreState.scanning != null || this.fromFeatureFlagStoreState == null) {
            enableTimes = Times.never();
            disableTimes = Times.never();
        }

        this.visualizationInstanceProcessorStub = null;
        this.getVisualizationInstanceProcessorMock = Mock.ofInstance(step => null);
        this.getVisualizationInstanceProcessorMock
            .setup(vimpcm => vimpcm(It.isAny()))
            .returns(() => this.visualizationInstanceProcessorStub);

        this.visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        this.visualizationConfigurationFactoryMock
            .setup(vcfm => vcfm.getConfiguration(It.isAny()))
            .returns(theVisualizationType => {
                const config = this.actualVisualizationConfigurationFactory.getConfiguration(theVisualizationType);
                config.visualizationInstanceProcessor = this.getVisualizationInstanceProcessorMock.object;
                return config;
            });

        this.drawingInitiatorMock
            .setup(dw =>
                dw.enableVisualization(
                    visualizationType,
                    this.fromFeatureFlagStoreState,
                    this.selectorMap,
                    It.isAny(),
                    this.visualizationInstanceProcessorStub,
                ),
            )
            .verifiable(enableTimes);

        this.drawingInitiatorMock
            .setup(dw => dw.disableVisualization(visualizationType, this.fromFeatureFlagStoreState, It.isAny()))
            .verifiable(disableTimes);

        this.selectorMapHelperMock
            .setup(sm => sm.getSelectorMap(visualizationType))
            .returns(() => this.selectorMap)
            .verifiable(Times.once());
    }

    private getToStateForType(visualizationType: VisualizationType): any {
        switch (visualizationType) {
            case VisualizationType.Headings:
                return this.toVisualizationStoreState.tests.adhoc.headings;
            case VisualizationType.Issues:
                return this.toVisualizationStoreState.tests.adhoc.issues;
            case VisualizationType.Landmarks:
                return this.toVisualizationStoreState.tests.adhoc.landmarks;
            default:
                return null;
        }
    }

    private getFromStateForType(visualizationType: VisualizationType): ScanData {
        switch (visualizationType) {
            case VisualizationType.Headings:
                return this.fromVisualizationStoreState.tests.adhoc.headings;
            case VisualizationType.Issues:
                return this.fromVisualizationStoreState.tests.adhoc.issues;
            case VisualizationType.Landmarks:
                return this.fromVisualizationStoreState.tests.adhoc.landmarks;
            default:
                return null;
        }
    }
}
