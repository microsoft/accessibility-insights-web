// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { AssessmentsProviderImpl } from '../../../../assessments/assessments-provider';
import { AssessmentDataConverter } from '../../../../background/assessment-data-converter';
import { FeatureFlagStore } from '../../../../background/stores/global/feature-flag-store';
import { TabStore } from '../../../../background/stores/tab-store';
import { VisualizationScanResultStore } from '../../../../background/stores/visualization-scan-result-store';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import { BaseStore } from '../../../../common/base-store';
import { TestMode } from '../../../../common/configs/test-mode';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../common/enum-helper';
import { getDefaultFeatureFlagValues } from '../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../../../../common/types/store-data/ivisualization-scan-result-data';
import { IScanData, IVisualizationStoreData } from '../../../../common/types/store-data/ivisualization-store-data';
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

describe('ClientViewControllerTest', () => {
    test('initialize', () => {
        let privateListenerVisStore;
        let privateListenerVisScanStore;
        let privateListenerAssessmentStore;

        const visualizationStore = Mock.ofType(VisualizationStore, MockBehavior.Strict);
        const visualizationScanResultStoreMock = Mock.ofType(VisualizationScanResultStore, MockBehavior.Strict);
        const assessmentStoreMock = Mock.ofType<BaseStore<IAssessmentStoreData>>(null, MockBehavior.Strict);
        const tabStoreMock = Mock.ofType<BaseStore<ITabStoreData>>(TabStore, MockBehavior.Strict);
        const featureFlagStoreMock = Mock.ofType(FeatureFlagStore);

        visualizationStore
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerVisStore = listener;
            })
            .verifiable();
        visualizationScanResultStoreMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerVisScanStore = listener;
            })
            .verifiable();
        assessmentStoreMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {
                privateListenerAssessmentStore = listener;
            })
            .verifiable();
        tabStoreMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(listener => {})
            .verifiable();

        const testObject = new ClientViewController(
            visualizationStore.object,
            visualizationScanResultStoreMock.object,
            null,
            null,
            null,
            featureFlagStoreMock.object,
            assessmentStoreMock.object,
            tabStoreMock.object,
            null,
            null,
        );
        testObject.initialize();

        visualizationStore.verifyAll();
        visualizationScanResultStoreMock.verifyAll();
        assessmentStoreMock.verifyAll();
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
    private _fromVisualizationStoreState: IVisualizationStoreData;
    private _toVisualizationStoreState: IVisualizationStoreData;
    private _fromVisualizationScanStoreState: IVisualizationScanResultData;
    private _toVisualizationScanStoreState: IVisualizationScanResultData;
    private _fromAssessmentStoreState: IAssessmentStoreData;
    private _toAssessmentStoreState: IAssessmentStoreData;
    private _fromTabStoreState: ITabStoreData;
    private _toTabStoreState: ITabStoreData;
    private _fromTargetTabId: number;
    private _toTargetTabId: number;

    private _fromFeatureFlagStoreState: FeatureFlagStoreData = getDefaultFeatureFlagValues();
    private _toFeatureFlagStoreState: FeatureFlagStoreData = getDefaultFeatureFlagValues();
    private _visualizationStore: IMock<BaseStore<IVisualizationStoreData>>;
    private _assessmentStoreMock: IMock<BaseStore<IAssessmentStoreData>>;
    private _tabStoreMock: IMock<BaseStore<ITabStoreData>>;
    private _selectorMapHelperMock: IMock<SelectorMapHelper>;
    private _visualizationScanResultStoreMock: IMock<BaseStore<IVisualizationScanResultData>>;
    private _featureFlagStoreMock: IMock<BaseStore<DictionaryStringTo<boolean>>>;
    private _drawingInitiatorMock: IMock<DrawingInitiator>;
    private _scrollingControllerMock: IMock<ScrollingController>;
    private _dataBuilderForFromVisualizationStoreState: VisualizationStoreDataBuilder = new VisualizationStoreDataBuilder();
    private _dataBuilderForToVisualizationStoreState: VisualizationStoreDataBuilder = new VisualizationStoreDataBuilder();
    private _dataBuilderForFromVisualizationScanStoreState = new VisualizationScanResultStoreDataBuilder();
    private _dataBuilderForToVisualizationScanStoreState = new VisualizationScanResultStoreDataBuilder();
    private IsScrollingInitiatorSetup: boolean = false;
    private _initializedVisualizationState: DictionaryStringTo<boolean> = {};
    private _initializedVisualizationSelectorMapState: DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>> = {};
    private _selectorMap: DictionaryStringTo<AssessmentVisualizationInstance>;
    private _visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    private _actualVisualizationConfigurationFactory: VisualizationConfigurationFactory;
    private _visualizationInstanceProcessorStub: VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>;
    private _getVisualizationInstanceProcessorMock: IMock<
        (testStep?: string) => VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>
    >;
    private _targetPageActionMessageCreatorMock: IMock<TargetPageActionMessageCreator>;

    public setScanning(id: string): MocksAndTestSubjectBuilder {
        this._dataBuilderForToVisualizationStoreState.with('scanning', id);
        return this;
    }

    public toDisabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this._dataBuilderForToVisualizationStoreState.withDisable(visualizationType);
        return this;
    }

    public toEnabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this._dataBuilderForToVisualizationStoreState.withEnable(visualizationType);
        return this;
    }

    public fromDisabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this._dataBuilderForFromVisualizationStoreState.withDisable(visualizationType);
        return this;
    }

    public fromEnabled(visualizationType: VisualizationType): MocksAndTestSubjectBuilder {
        this._dataBuilderForFromVisualizationStoreState.withEnable(visualizationType);
        return this;
    }

    public fromAssessmentTarget(id: number): MocksAndTestSubjectBuilder {
        this._fromTargetTabId = id;
        return this;
    }

    public toAssessmentTarget(id: number): MocksAndTestSubjectBuilder {
        this._toTargetTabId = id;
        return this;
    }

    public fromFocusedTarget(target: string[]): MocksAndTestSubjectBuilder {
        this._dataBuilderForFromVisualizationStoreState.withFocusedTarget(target);
        return this;
    }

    public ToFocusedTarget(target: string[]): MocksAndTestSubjectBuilder {
        this._dataBuilderForToVisualizationStoreState.withFocusedTarget(target);
        return this;
    }

    public setFullIdToRuleResultMap(map): MocksAndTestSubjectBuilder {
        this._dataBuilderForToVisualizationScanStoreState.withFullIdToRuleResultMapForIssues(map);
        return this;
    }

    public fromFeatureFlagState(state: FeatureFlagStoreData): MocksAndTestSubjectBuilder {
        this._fromFeatureFlagStoreState = state;
        return this;
    }

    public setupScrolling(times: Times, message: ScrollingWindowMessage): MocksAndTestSubjectBuilder {
        this._scrollingControllerMock = Mock.ofType(ScrollingController);
        this._scrollingControllerMock.setup(s => s.processRequest(It.isValue(message))).verifiable(times);
        this.IsScrollingInitiatorSetup = true;

        this._targetPageActionMessageCreatorMock = Mock.ofType(TargetPageActionMessageCreator);
        this._targetPageActionMessageCreatorMock.setup(m => m.scrollRequested()).verifiable(times);

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
            this._visualizationStore.object,
            this._visualizationScanResultStoreMock.object,
            this._drawingInitiatorMock.object,
            this._scrollingControllerMock.object,
            this._visualizationConfigurationFactoryMock.object,
            this._featureFlagStoreMock.object,
            this._assessmentStoreMock.object,
            this._tabStoreMock.object,
            this._selectorMapHelperMock.object,
            this._targetPageActionMessageCreatorMock.object,
        );

        (controller as any).currentVisualizationState = this._visualizationStore.object.getState();
        (controller as any).currentScanResultState = this._visualizationScanResultStoreMock.object.getState();
        (controller as any).currentAssessmentState = this._assessmentStoreMock.object.getState();
        (controller as any).currentTabState = this._tabStoreMock.object.getState();

        controller.setPreviousVisualizationStatesStub(this._initializedVisualizationState);
        controller.setPreviousVisualizationSelectorMapStatesStub(this._initializedVisualizationSelectorMapState);
        this._actualVisualizationConfigurationFactory = new VisualizationConfigurationFactory();

        return controller;
    }

    public verifyAll(): void {
        this._drawingInitiatorMock.verifyAll();
        this._visualizationStore.verifyAll();
        if (this.IsScrollingInitiatorSetup) {
            this._scrollingControllerMock.verifyAll();
            this._targetPageActionMessageCreatorMock.verifyAll();
        }
    }

    private setupDrawingControllerAndSelectorMapMock(): void {
        this._drawingInitiatorMock = Mock.ofType(DrawingInitiator);
        this._selectorMapHelperMock = Mock.ofType(SelectorMapHelper);
        this.setupVisualizationMocks();
    }

    private buildPreviousStateStub(): void {
        const factory = new VisualizationConfigurationFactory();
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => {
            const config = factory.getConfiguration(visualizationType);
            if (config.testMode === TestMode.Adhoc) {
                const id = config.getIdentifier();
                this._initializedVisualizationState[id] = this.getFromStateForType(visualizationType)
                    ? this.getFromStateForType(visualizationType).enabled
                    : false;
            }
        });
    }

    private buildPreviousSelectorMapStatesStub(): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => (this._initializedVisualizationSelectorMapState[visualizationType] = this._selectorMap));
    }

    private setupScrollingControllerMock(): void {
        this._scrollingControllerMock = this._scrollingControllerMock || Mock.ofType(ScrollingController);
    }

    private setupTargetActionCreatorMock(): void {
        this._targetPageActionMessageCreatorMock = this._targetPageActionMessageCreatorMock || Mock.ofType(TargetPageActionMessageCreator);
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
        this._fromVisualizationStoreState = this._dataBuilderForFromVisualizationStoreState.build();
        this._toVisualizationStoreState = this._dataBuilderForToVisualizationStoreState.build();
        this._fromVisualizationScanStoreState = this._dataBuilderForFromVisualizationScanStoreState.build();
        this._toVisualizationScanStoreState = this._dataBuilderForToVisualizationScanStoreState.build();
        this._fromAssessmentStoreState = new AssessmentsStoreDataBuilder(assessmentsProviderMock.object, assessmentDataConverterMock.object)
            .withTargetTab(this._fromTargetTabId, null, null, false)
            .build();
        this._toAssessmentStoreState = new AssessmentsStoreDataBuilder(assessmentsProviderMock.object, assessmentDataConverterMock.object)
            .withTargetTab(this._toTargetTabId, null, null, false)
            .build();
        this._fromTabStoreState = { id: 1 } as ITabStoreData;
        this._toTabStoreState = { id: 1 } as ITabStoreData;

        this._selectorMap = {
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
        this._visualizationStore = Mock.ofType(VisualizationStore);
        this._assessmentStoreMock = Mock.ofType<BaseStore<IAssessmentStoreData>>();
        this._tabStoreMock = Mock.ofType<BaseStore<ITabStoreData>>(TabStore);
        this._visualizationScanResultStoreMock = Mock.ofType(VisualizationScanResultStore);
        this._featureFlagStoreMock = Mock.ofType(FeatureFlagStore);

        this._visualizationStore.setup(sm => sm.getState()).returns(() => this._fromVisualizationStoreState);

        this._visualizationStore.setup(sm => sm.getState()).returns(() => this._toVisualizationStoreState);

        this._visualizationScanResultStoreMock.setup(sm => sm.getState()).returns(() => this._fromVisualizationScanStoreState);

        this._visualizationScanResultStoreMock.setup(sm => sm.getState()).returns(() => this._toVisualizationScanStoreState);

        this._assessmentStoreMock.setup(sm => sm.getState()).returns(() => this._fromAssessmentStoreState);

        this._assessmentStoreMock.setup(sm => sm.getState()).returns(() => this._toAssessmentStoreState);

        this._tabStoreMock
            .setup(sm => sm.getState())
            .returns(() => this._fromTabStoreState)
            .verifiable();

        this._tabStoreMock.setup(sm => sm.getState()).returns(() => this._toTabStoreState);

        this._featureFlagStoreMock.setup(sm => sm.getState()).returns(() => this._fromFeatureFlagStoreState);

        this._featureFlagStoreMock.setup(sm => sm.getState()).returns(() => this._toFeatureFlagStoreState);
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

        if (this._toVisualizationStoreState.scanning != null || this._fromFeatureFlagStoreState == null) {
            enableTimes = Times.never();
            disableTimes = Times.never();
        }

        this._visualizationInstanceProcessorStub = null;
        this._getVisualizationInstanceProcessorMock = Mock.ofInstance(step => null);
        this._getVisualizationInstanceProcessorMock
            .setup(vimpcm => vimpcm(It.isAny()))
            .returns(() => this._visualizationInstanceProcessorStub);

        this._visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        this._visualizationConfigurationFactoryMock
            .setup(vcfm => vcfm.getConfiguration(It.isAny()))
            .returns(theVisualizationType => {
                const config = this._actualVisualizationConfigurationFactory.getConfiguration(theVisualizationType);
                config.visualizationInstanceProcessor = this._getVisualizationInstanceProcessorMock.object;
                return config;
            });

        this._drawingInitiatorMock
            .setup(dw =>
                dw.enableVisualization(
                    visualizationType,
                    this._fromFeatureFlagStoreState,
                    this._selectorMap,
                    It.isAny(),
                    this._visualizationInstanceProcessorStub,
                ),
            )
            .verifiable(enableTimes);

        this._drawingInitiatorMock
            .setup(dw => dw.disableVisualization(visualizationType, this._fromFeatureFlagStoreState, It.isAny()))
            .verifiable(disableTimes);

        this._selectorMapHelperMock
            .setup(sm => sm.getSelectorMap(visualizationType))
            .returns(() => this._selectorMap)
            .verifiable(Times.once());
    }

    private getToStateForType(visualizationType: VisualizationType): any {
        switch (visualizationType) {
            case VisualizationType.Headings:
                return this._toVisualizationStoreState.tests.adhoc.headings;
            case VisualizationType.Issues:
                return this._toVisualizationStoreState.tests.adhoc.issues;
            case VisualizationType.Landmarks:
                return this._toVisualizationStoreState.tests.adhoc.landmarks;
            default:
                return null;
        }
    }

    private getFromStateForType(visualizationType: VisualizationType): IScanData {
        switch (visualizationType) {
            case VisualizationType.Headings:
                return this._fromVisualizationStoreState.tests.adhoc.headings;
            case VisualizationType.Issues:
                return this._fromVisualizationStoreState.tests.adhoc.issues;
            case VisualizationType.Landmarks:
                return this._fromVisualizationStoreState.tests.adhoc.landmarks;
            default:
                return null;
        }
    }
}
