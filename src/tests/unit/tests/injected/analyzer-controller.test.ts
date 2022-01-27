// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseStore } from '../../../../common/base-store';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../common/enum-helper';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { ScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AnalyzerController } from '../../../../injected/analyzer-controller';
import { AnalyzerStateUpdateHandler } from '../../../../injected/analyzer-state-update-handler';
import { Analyzer } from '../../../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../../../injected/analyzers/analyzer-provider';
import { ScopingStoreDataBuilder } from '../../common/scoping-store-data-builder';
import { IsSameObject } from '../../common/typemoq-helper';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('AnalyzerControllerTests', () => {
    let visualizationStoreMock: IMock<VisualizationStore>;
    let visualizationScanResultsStoreMock: IMock<VisualizationScanResultStore>;
    let scopingStoreMock: IMock<BaseStore<ScopingStoreData>>;
    let featureFlagStoreStoreMock: IMock<FeatureFlagStore>;
    let testType: VisualizationType;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let getAnalyzerMock: IMock<(provider: AnalyzerProvider) => Analyzer>;
    let getIdentifierMock: IMock<() => string>;
    let identifier: string;
    let configStub: VisualizationConfiguration;

    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let visualizationStoreState: VisualizationStoreData;
    let visualizationScanResultsStoreState: VisualizationScanResultData;
    let featureFlagStoreState: FeatureFlagStoreData;
    let scopingStoreState: ScopingStoreData;
    let analyzerProviderStrictMock: IMock<AnalyzerProvider>;
    let analyzerMock: IMock<Analyzer>;
    let analyzerStateUpdateHandlerStrictMock: IMock<AnalyzerStateUpdateHandler>;
    let assessmentsMock: IMock<AssessmentsProvider>;
    let testObject: AnalyzerController;
    let teardown: (id: string) => void;
    let startScan: (id: string) => void;

    beforeEach(() => {
        testType = -1 as VisualizationType;
        getStoreDataMock = Mock.ofInstance(data => {
            return null;
        });
        getAnalyzerMock = Mock.ofInstance((provider: AnalyzerProvider) => {
            return null;
        });
        getIdentifierMock = Mock.ofInstance(() => {
            return null;
        });
        configStub = {
            getStoreData: getStoreDataMock.object,
            getAnalyzer: getAnalyzerMock.object,
            getIdentifier: getIdentifierMock.object,
        } as any;

        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        assessmentsMock = Mock.ofType(AssessmentsProviderImpl);
        visualizationStoreMock = Mock.ofType<VisualizationStore>();
        visualizationScanResultsStoreMock = Mock.ofType<VisualizationScanResultStore>();
        featureFlagStoreStoreMock = Mock.ofType<FeatureFlagStore>();
        scopingStoreMock = Mock.ofType<ScopingStore>(ScopingStore);
        tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();

        visualizationStoreMock.setup(sm => sm.getState()).returns(() => visualizationStoreState);

        visualizationScanResultsStoreMock
            .setup(sm => sm.getState())
            .returns(() => visualizationScanResultsStoreState);

        featureFlagStoreStoreMock.setup(sm => sm.getState()).returns(() => featureFlagStoreState);

        scopingStoreMock.setup(sm => sm.getState()).returns(() => scopingStoreState);

        analyzerProviderStrictMock = Mock.ofType<AnalyzerProvider>(null, MockBehavior.Strict);
        analyzerStateUpdateHandlerStrictMock = Mock.ofType<AnalyzerStateUpdateHandler>(
            null,
            MockBehavior.Strict,
        );
        analyzerStateUpdateHandlerStrictMock
            .setup(handler => handler.setupHandlers(It.isAny(), It.isAny()))
            .returns((startScanCb, teardownCb) => {
                startScan = startScanCb;
                teardown = teardownCb;
            })
            .verifiable(Times.once());

        analyzerMock = Mock.ofType(AnalyzerStub, MockBehavior.Strict);

        featureFlagStoreState = {};
        visualizationStoreState = null;
        visualizationScanResultsStoreState = null;
        scopingStoreState = null;

        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            setupVisualizationConfigurationFactory(test, configStub);
        });

        identifier = 'fake-key';
        const times = Times.exactly(EnumHelper.getNumericValues(VisualizationType).length);
        setupGetIdentifierMock(identifier, times);
        setupGetAnalyzerMockCalled(times);

        testObject = new AnalyzerController(
            visualizationStoreMock.object,
            visualizationScanResultsStoreMock.object,
            featureFlagStoreStoreMock.object,
            scopingStoreMock.object,
            visualizationConfigurationFactoryMock.object,
            analyzerProviderStrictMock.object,
            analyzerStateUpdateHandlerStrictMock.object,
            assessmentsMock.object,
            tabStopRequirementActionMessageCreatorMock.object,
        );
    });

    afterEach(() => {
        visualizationStoreMock.verifyAll();
        visualizationScanResultsStoreMock.verifyAll();
        featureFlagStoreStoreMock.verifyAll();
        scopingStoreMock.verifyAll();
        analyzerProviderStrictMock.verifyAll();
        featureFlagStoreState = {};
    });

    test('handleUpdate when stores are initialized', () => {
        assessmentsMock
            .setup(mock => mock.isValidType(It.isAny()))
            .returns(() => false)
            .verifiable(Times.atLeastOnce());

        visualizationStoreState = new VisualizationStoreDataBuilder()
            .with('scanning', testType.toString())
            .build();

        scopingStoreState = new ScopingStoreDataBuilder().build();

        analyzerStateUpdateHandlerStrictMock
            .setup(handler => handler.handleUpdate(visualizationStoreState))
            .verifiable(Times.once());

        testObject.listenToStore();

        analyzerStateUpdateHandlerStrictMock.verifyAll();
        getAnalyzerMock.verifyAll();
        getIdentifierMock.verifyAll();
    });

    test('onResultsChangedState sends message when tabbing is completed', () => {
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateNeedToCollectTabbingResults(false))
            .verifiable(Times.once());

        visualizationScanResultsStoreState = {
            tabStops: { tabbingCompleted: true, needToCollectTabbingResults: true },
        } as VisualizationScanResultData;

        assessmentsMock
            .setup(mock => mock.isValidType(It.isAny()))
            .returns(() => false)
            .verifiable(Times.atLeastOnce());
        setupVisualizationConfigurationFactory(VisualizationType.TabStops, configStub);
        setupTeardownCall();
        getIdentifierMock.reset();
        setupGetIdentifierMock('tabStops', Times.atLeastOnce());

        const visualizationResultsListener = setupTabbingStoreData();
        visualizationResultsListener();

        tabStopRequirementActionMessageCreatorMock.verifyAll();
        getIdentifierMock.verifyAll();
        assessmentsMock.verifyAll();
        analyzerMock.verifyAll();
    });

    test('onResultsChangedState does not send message when tabbing is not completed', () => {
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateNeedToCollectTabbingResults(It.isAny()))
            .verifiable(Times.never());

        visualizationScanResultsStoreState = {
            tabStops: { tabbingCompleted: false, needToCollectTabbingResults: false },
        } as VisualizationScanResultData;

        const visualizationResultsListener = setupTabbingStoreData();
        visualizationResultsListener();

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });

    test('do not scan on if any store state is null', () => {
        visualizationStoreState = null;

        scopingStoreState = new ScopingStoreDataBuilder().build();

        setupVisualizationConfigurationFactory(testType, configStub);
        assessmentsMock
            .setup(mock => mock.isValidType(It.isAny()))
            .returns(() => false)
            .verifiable(Times.atLeastOnce());

        analyzerStateUpdateHandlerStrictMock
            .setup(handler => handler.handleUpdate(visualizationStoreState))
            .verifiable(Times.never());

        testObject.listenToStore();

        analyzerStateUpdateHandlerStrictMock.verifyAll();
        getAnalyzerMock.verifyAll();
        getIdentifierMock.verifyAll();
    });

    test('startScan', () => {
        testObject.listenToStore();

        getAnalyzerMock.reset();
        setupAnalyzeCall();
        setupGetAnalyzerMockNeverCalled();

        startScan(identifier);

        visualizationConfigurationFactoryMock.verifyAll();
        getAnalyzerMock.verifyAll();
        getIdentifierMock.verifyAll();
        analyzerMock.verifyAll();
    });

    test('teardown', () => {
        testObject.listenToStore();

        getAnalyzerMock.reset();
        setupTeardownCall();
        setupGetAnalyzerMockNeverCalled();

        teardown(identifier);

        visualizationConfigurationFactoryMock.verifyAll();
        getAnalyzerMock.verifyAll();
        getIdentifierMock.verifyAll();
        analyzerMock.verifyAll();
    });

    function setupTabbingStoreData(): () => void {
        let visualizationResultsListener;
        visualizationScanResultsStoreMock
            .setup(m => m.addChangedListener(It.isAny()))
            .returns(listener => {
                visualizationResultsListener = listener;
            });

        testObject.listenToStore();
        return visualizationResultsListener;
    }

    function setupAnalyzeCall(): void {
        analyzerMock.setup(am => am.analyze()).verifiable();
    }

    function setupTeardownCall(): void {
        analyzerMock.setup(am => am.teardown()).verifiable();
    }

    function setupGetIdentifierMock(key: string, times): void {
        getIdentifierMock
            .setup(gim => gim())
            .returns(step => key)
            .verifiable(times);
    }

    function setupGetAnalyzerMockCalled(times): void {
        getAnalyzerMock
            .setup(gam => gam(IsSameObject(analyzerProviderStrictMock.object)))
            .returns(() => analyzerMock.object)
            .verifiable(times);
    }

    function setupGetAnalyzerMockNeverCalled(): void {
        getAnalyzerMock
            .setup(gam => gam(IsSameObject(analyzerProviderStrictMock.object)))
            .returns(() => analyzerMock.object)
            .verifiable(Times.never());
    }

    function setupVisualizationConfigurationFactory(
        visualizationType: VisualizationType,
        returnedConfig: VisualizationConfiguration,
    ): void {
        visualizationConfigurationFactoryMock
            .setup(v => v.getConfiguration(visualizationType))
            .returns((visType: VisualizationType) => {
                return returnedConfig;
            });
    }
});

class AnalyzerStub implements Analyzer {
    public analyze(): void {
        throw new Error('Method not implemented.');
    }
    public teardown(): void {
        throw new Error('Method not implemented.');
    }
}
