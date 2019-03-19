// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { AssessmentsProvider } from '../../../../assessments/assessments-provider';
import { IAssessmentsProvider } from '../../../../assessments/types/iassessments-provider';
import { FeatureFlagStore } from '../../../../background/stores/global/feature-flag-store';
import { ScopingStore } from '../../../../background/stores/global/scoping-store';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import {
    VisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../common/enum-helper';
import { IBaseStore } from '../../../../common/istore';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { IScanData, IVisualizationStoreData, TestsEnabledState } from '../../../../common/types/store-data/ivisualization-store-data';
import { IScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AnalyzerController } from '../../../../injected/analyzer-controller';
import { AnalyzerStateUpdateHandler } from '../../../../injected/analyzer-state-update-handler';
import { IAnalyzer } from '../../../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../../../injected/analyzers/analyzer-provider';
import { TabStopsListener } from '../../../../injected/tab-stops-listener';
import { ScopingStoreDataBuilder } from '../../common/scoping-store-data-builder';
import { IsSameObject } from '../../common/typemoq-helper';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('AnalyzerControllerTests', () => {
    let visualizationStoreMock: IMock<VisualizationStore>;
    let scopingStoreMock: IMock<IBaseStore<IScopingStoreData>>;
    let featureFlagStoreStoreMock: IMock<FeatureFlagStore>;
    let testType: VisualizationType;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => IScanData>;
    let getAnalyzerMock: IMock<(provider: AnalyzerProvider) => IAnalyzer>>;
    let getIdentifierMock: IMock<() => string>;
    let identifier: string;
    let configStub: VisualizationConfiguration;

    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;

    let visualizationStoreState: IVisualizationStoreData;
    let featureFlagStoreState: FeatureFlagStoreData;
    let scopingStoreState: IScopingStoreData;
    let analyzerProviderStrictMock: IMock<AnalyzerProvider>;
    let analyzerMock: IMock<IAnalyzer>;
    let tabStopsListenerMock: IMock<TabStopsListener>;
    let sendMessageMock: IMock<(message) => void>;
    let analyzerStateUpdateHandlerStrictMock: IMock<AnalyzerStateUpdateHandler>;
    let assessmentsMock: IMock<IAssessmentsProvider>;
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

        tabStopsListenerMock = Mock.ofType(TabStopsListener);
        visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        assessmentsMock = Mock.ofType(AssessmentsProvider);
        visualizationStoreMock = Mock.ofType<VisualizationStore>();
        featureFlagStoreStoreMock = Mock.ofType<FeatureFlagStore>();
        scopingStoreMock = Mock.ofType<ScopingStore>(ScopingStore);

        visualizationStoreMock.setup(sm => sm.getState()).returns(() => visualizationStoreState);

        featureFlagStoreStoreMock.setup(sm => sm.getState()).returns(() => featureFlagStoreState);

        scopingStoreMock.setup(sm => sm.getState()).returns(() => scopingStoreState);

        analyzerProviderStrictMock = Mock.ofType<AnalyzerProvider>(null, MockBehavior.Strict);
        analyzerStateUpdateHandlerStrictMock = Mock.ofType<AnalyzerStateUpdateHandler>(null, MockBehavior.Strict);
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
        scopingStoreState = null;

        sendMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);

        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            setupVisualizationConfigurationFactory(test, configStub);
        });

        identifier = 'fake-key';
        const times = Times.exactly(EnumHelper.getNumericValues(VisualizationType).length);
        setupGetIdentifierMock(identifier, times);
        setupGetAnalyzerMockCalled(times);

        testObject = new AnalyzerController(
            sendMessageMock.object,
            visualizationStoreMock.object,
            featureFlagStoreStoreMock.object,
            scopingStoreMock.object,
            tabStopsListenerMock.object,
            visualizationConfigurationFactoryMock.object,
            analyzerProviderStrictMock.object,
            analyzerStateUpdateHandlerStrictMock.object,
            assessmentsMock.object,
        );
    });

    afterEach(() => {
        visualizationStoreMock.verifyAll();
        featureFlagStoreStoreMock.verifyAll();
        scopingStoreMock.verifyAll();
        analyzerProviderStrictMock.verifyAll();
        sendMessageMock.verifyAll();
        featureFlagStoreState = {};
    });

    test('handleUpdate when stores are initialized', () => {
        assessmentsMock
            .setup(mock => mock.isValidType(It.isAny()))
            .returns(() => false)
            .verifiable(Times.atLeastOnce());

        visualizationStoreState = new VisualizationStoreDataBuilder().with('scanning', testType.toString()).build();

        scopingStoreState = new ScopingStoreDataBuilder().build();

        analyzerStateUpdateHandlerStrictMock.setup(handler => handler.handleUpdate(visualizationStoreState)).verifiable(Times.once());

        testObject.listenToStore();

        analyzerStateUpdateHandlerStrictMock.verifyAll();
        getAnalyzerMock.verifyAll();
        getIdentifierMock.verifyAll();
    });

    test('do not scan on if any store state is null', () => {
        visualizationStoreState = null;

        scopingStoreState = new ScopingStoreDataBuilder().build();

        setupVisualizationConfigurationFactory(testType, configStub);
        assessmentsMock
            .setup(mock => mock.isValidType(It.isAny()))
            .returns(() => false)
            .verifiable(Times.atLeastOnce());

        analyzerStateUpdateHandlerStrictMock.setup(handler => handler.handleUpdate(visualizationStoreState)).verifiable(Times.never());

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

    function setupVisualizationConfigurationFactory(type: VisualizationType, returnedConfig: VisualizationConfiguration): void {
        visualizationConfigurationFactoryMock
            .setup(v => v.getConfiguration(type))
            .returns((visType: VisualizationType) => {
                return returnedConfig;
            });
    }

    function setupGetStoreDataMock(tests: TestsEnabledState, scanData: IScanData): void {
        getStoreDataMock.setup(gcdm => gcdm(tests)).returns(() => scanData);
    }
});

class AnalyzerStub implements IAnalyzer {
    public analyze(): void {
        throw new Error('Method not implemented.');
    }
    public teardown(): void {
        throw new Error('Method not implemented.');
    }
}
