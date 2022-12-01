// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
} from 'DetailsView/components/details-view-switcher-nav';
import { AnalyzerMessageConfiguration } from 'injected/analyzers/get-analyzer-message-types';
import { ShadowInitializer } from 'injected/shadow-initializer';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseStore } from '../../../../common/base-store';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import {
    ForEachConfigCallback,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
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
import { Analyzer, AnalyzerConfiguration } from '../../../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../../../injected/analyzers/analyzer-provider';
import { ScopingStoreDataBuilder } from '../../common/scoping-store-data-builder';
import { IsSameObject } from '../../common/typemoq-helper';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('AnalyzerControllerTests', () => {
    let visualizationStoreMock: IMock<VisualizationStore>;
    let scopingStoreMock: IMock<BaseStore<ScopingStoreData, Promise<void>>>;
    let featureFlagStoreStoreMock: IMock<FeatureFlagStore>;
    let testType: VisualizationType;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let getAnalyzerMock: IMock<
        (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) => Analyzer
    >;
    let getIdentifierMock: IMock<(key?: string) => string>;
    let identifier: string;
    let configStub: VisualizationConfiguration;
    let requirementStub: Requirement;
    let messageConfigurationStub: AnalyzerMessageConfiguration;
    let switcherConfigurationStub: DetailsViewSwitcherNavConfiguration;

    let getDetailsSwitcherNavConfigurationMock: IMock<GetDetailsSwitcherNavConfiguration>;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationStoreState: VisualizationStoreData;
    let featureFlagStoreState: FeatureFlagStoreData;
    let scopingStoreState: ScopingStoreData;
    let analyzerProviderStrictMock: IMock<AnalyzerProvider>;
    let analyzerMock: IMock<Analyzer>;
    let analyzerStateUpdateHandlerStrictMock: IMock<AnalyzerStateUpdateHandler>;
    let assessmentsMock: IMock<AssessmentsProvider>;
    let shadowInitializerMock: IMock<ShadowInitializer>;
    let analyzerInitializeCallback: ForEachConfigCallback;
    let testObject: AnalyzerController;
    let teardown: (id: string) => void;
    let startScan: (id: string) => void;

    beforeEach(() => {
        testType = -1 as VisualizationType;
        getStoreDataMock = Mock.ofInstance(data => {
            return null;
        });
        getAnalyzerMock = Mock.ofInstance(
            (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) => {
                return null;
            },
        );
        getIdentifierMock = Mock.ofInstance(() => {
            return null;
        });
        messageConfigurationStub = {
            analyzerMessageType: 'some message type',
        };
        getDetailsSwitcherNavConfigurationMock = Mock.ofType<GetDetailsSwitcherNavConfiguration>();
        configStub = {
            getStoreData: getStoreDataMock.object,
            getAnalyzer: getAnalyzerMock.object,
            getIdentifier: getIdentifierMock.object,
            messageConfiguration: messageConfigurationStub,
        } as any;
        requirementStub = {
            key: 'some requirement key',
        } as Requirement;
        switcherConfigurationStub = {
            analyzerMessageConfiguration: messageConfigurationStub,
        } as DetailsViewSwitcherNavConfiguration;

        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        assessmentsMock = Mock.ofType(AssessmentsProviderImpl);
        visualizationStoreMock = Mock.ofType<VisualizationStore>();
        featureFlagStoreStoreMock = Mock.ofType<FeatureFlagStore>();
        scopingStoreMock = Mock.ofType<ScopingStore>(ScopingStore);
        shadowInitializerMock = Mock.ofType<ShadowInitializer>();

        visualizationStoreMock.setup(sm => sm.getState()).returns(() => visualizationStoreState);

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
        scopingStoreState = null;

        visualizationConfigurationFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(givenCallback => {
                analyzerInitializeCallback = givenCallback;
                analyzerInitializeCallback(configStub, testType, requirementStub);
            });

        identifier = 'fake-key';
        setupGetIdentifierMock(identifier, requirementStub);
        setupGetAnalyzerMockCalled(requirementStub);

        testObject = new AnalyzerController(
            visualizationStoreMock.object,
            featureFlagStoreStoreMock.object,
            scopingStoreMock.object,
            visualizationConfigurationFactoryMock.object,
            analyzerProviderStrictMock.object,
            analyzerStateUpdateHandlerStrictMock.object,
            assessmentsMock.object,
            shadowInitializerMock.object,
            getDetailsSwitcherNavConfigurationMock.object,
        );
    });

    afterEach(() => {
        visualizationStoreMock.verifyAll();
        featureFlagStoreStoreMock.verifyAll();
        scopingStoreMock.verifyAll();
        analyzerProviderStrictMock.verifyAll();
        shadowInitializerMock.verifyAll();
        featureFlagStoreState = {};
    });

    test('listenToStore: verify initializiation and handle update', () => {
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
        getIdentifierMock.verifyAll();
        getAnalyzerMock.verifyAll();
    });

    test('listenToStore: verify initializiation and handle update for configs without requirements', () => {
        getIdentifierMock.reset();
        getAnalyzerMock.reset();
        requirementStub = null;
        setupGetIdentifierMock(identifier, requirementStub);
        setupGetAnalyzerMockCalled(requirementStub);

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
        getIdentifierMock.verifyAll();
        getAnalyzerMock.verifyAll();
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
        visualizationStoreState = new VisualizationStoreDataBuilder().build();

        testObject.listenToStore();

        getAnalyzerMock.reset();
        setupAnalyzeCall(visualizationStoreState);
        setupGetAnalyzerMockNeverCalled();

        shadowInitializerMock.setup(m => m.removeExistingShadowHost()).verifiable(Times.once());
        shadowInitializerMock.setup(m => m.initialize()).verifiable(Times.once());

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

    function setupAnalyzeCall(visualizationState: VisualizationStoreData): void {
        const expected = {
            selectedDetailsViewPivot: visualizationState.selectedDetailsViewPivot,
        };
        getDetailsSwitcherNavConfigurationMock
            .setup(m => m(It.isValue(expected)))
            .returns(() => switcherConfigurationStub);
        analyzerMock.setup(am => am.analyze(messageConfigurationStub)).verifiable();
    }

    function setupTeardownCall(): void {
        analyzerMock.setup(am => am.teardown()).verifiable();
    }

    function setupGetIdentifierMock(identifier: string, requirement: Requirement): void {
        getIdentifierMock
            .setup(gim => gim(requirement?.key))
            .returns(step => identifier)
            .verifiable();
    }

    function setupGetAnalyzerMockCalled(requirement: Requirement): void {
        const expectedAnalyzerConfig = {
            key: requirement?.key,
            testType,
            ...messageConfigurationStub,
        } as AnalyzerConfiguration;
        getAnalyzerMock
            .setup(gam =>
                gam(
                    IsSameObject(analyzerProviderStrictMock.object),
                    It.isValue(expectedAnalyzerConfig),
                ),
            )
            .returns(() => analyzerMock.object)
            .verifiable();
    }

    function setupGetAnalyzerMockNeverCalled(): void {
        getAnalyzerMock
            .setup(gam => gam(IsSameObject(analyzerProviderStrictMock.object), It.isAny()))
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
