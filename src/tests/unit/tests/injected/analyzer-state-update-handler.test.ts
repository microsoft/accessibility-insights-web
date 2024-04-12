// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import {
    ForEachConfigCallback,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
import {
    InjectingState,
    ScanData,
    VisualizationStoreData,
} from '../../../../common/types/store-data/visualization-store-data';
import { AnalyzerStateUpdateHandler } from '../../../../injected/analyzer-state-update-handler';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('AnalyzerStateUpdateHandlerTest', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let startScanMock: IMock<(id) => void>;
    let teardownMock: IMock<(id) => void>;
    let testObject: TestableAnalyzerStateUpdateHandler;
    let tearDownCallback: ForEachConfigCallback;
    let configMock: IMock<VisualizationConfiguration>;
    let requirementConfig: Requirement;

    beforeEach(() => {
        tearDownCallback = null;
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>(
            undefined,
            MockBehavior.Strict,
        );
        configMock = Mock.ofType<VisualizationConfiguration>();
        requirementConfig = {
            key: 'some requirement key',
        } as Requirement;
        startScanMock = Mock.ofInstance(id => {});
        teardownMock = Mock.ofInstance(id => {});
        testObject = new TestableAnalyzerStateUpdateHandler(
            visualizationConfigurationFactoryMock.object,
        );
        testObject.setupHandlers(startScanMock.object, teardownMock.object);
    });

    test('constructor', () => {
        expect(new AnalyzerStateUpdateHandler(null)).toBeDefined();
    });

    test('setup & call handlers', () => {
        const id = 'headings';
        startScanMock.setup(start => start(id)).verifiable(Times.once());
        teardownMock.setup(teardown => teardown(id)).verifiable(Times.once());
        testObject.getStartScanDelegate()(id);
        testObject.getTeardownDelegate()(id);

        startScanMock.verifyAll();
        teardownMock.verifyAll();
    });

    test('do not scan/teardown if nothing is scanning and no prevState', () => {
        const state = new VisualizationStoreDataBuilder().withLandmarksEnable().build();

        testObject.handleUpdate(state);

        teardownMock.verify(m => m(It.isAny()), Times.never());
        startScanMock.verify(m => m(It.isAny()), Times.never());
    });

    test.each([InjectingState.injectingRequested, InjectingState.injectingStarted])(
        'do not start scan if injectingState is %s and no prevState',
        injectingState => {
            const state = new VisualizationStoreDataBuilder()
                .with('scanning', 'landmarks')
                .with('injectingState', injectingState)
                .withLandmarksEnable()
                .build();

            testObject.handleUpdate(state);

            startScanMock.verify(m => m(It.isAny()), Times.never());
        },
    );

    test('do not start scan or terminate if state is not changed', () => {
        const prevState = new VisualizationStoreDataBuilder()
            .with('scanning', 'landmarks')
            .withLandmarksEnable()
            .build();
        const newState = prevState;
        testObject.setPrevState(prevState);

        setupDefaultVisualizationConfigFactory();
        setupIsTestTerminated(configMock, requirementConfig, prevState, newState, false, true);

        testObject.handleUpdate(newState);
        tearDownCallback(configMock.object, 0, requirementConfig);

        teardownMock.verify(m => m(It.isAny()), Times.never());
        startScanMock.verify(m => m(It.isAny()), Times.never());
    });

    test('start scan: prev state is null', () => {
        const currentlyScanning = 'some test id';
        const state = new VisualizationStoreDataBuilder()
            .with('scanning', currentlyScanning)
            .build();

        testObject.handleUpdate(state);

        startScanMock.verify(m => m(currentlyScanning), Times.once());
    });

    test('start scan w/o teardowns: inject just completed', () => {
        const scanningTestStub = 'some test id';
        const prevState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingStarted)
            .with('scanning', scanningTestStub)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.notInjecting)
            .with('scanning', scanningTestStub)
            .build();
        testObject.setPrevState(prevState);
        setupDefaultVisualizationConfigFactory();
        setupIsTestTerminated(configMock, requirementConfig, prevState, currState, true, true);

        testObject.handleUpdate(currState);
        tearDownCallback(configMock.object, 0, requirementConfig);

        startScanMock.verify(m => m(scanningTestStub), Times.once());
        teardownMock.verify(m => m(It.isAny()), Times.never());
    });

    // We still scan if injecting failed because it might have failed only for some frames - in
    // that case, we preform a partial scan and a different component detects a corresponding
    // axe-core "frame-tested" failure to display a warning to the user.
    test('start scan w/o teardowns: inject just failed', () => {
        const scanningTestStub = 'some test id';
        const prevState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingStarted)
            .with('scanning', scanningTestStub)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingFailed)
            .with('scanning', scanningTestStub)
            .build();
        testObject.setPrevState(prevState);
        setupDefaultVisualizationConfigFactory();
        setupIsTestTerminated(configMock, requirementConfig, prevState, currState, true, true);

        testObject.handleUpdate(currState);
        tearDownCallback(configMock.object, 0, requirementConfig);

        startScanMock.verify(m => m(scanningTestStub), Times.once());
        teardownMock.verify(m => m(It.isAny()), Times.never());
    });

    test('teardown when a test is turned form enabled to disabled', () => {
        const enabledTest = 'some test id';
        const prevState = {
            tests: {
                assessments: {},
            },
        } as VisualizationStoreData;
        const currState = {
            tests: {
                adhoc: {},
            },
        } as VisualizationStoreData;
        testObject.setPrevState(prevState);
        setupDefaultVisualizationConfigFactory();
        setupIsTestTerminated(configMock, requirementConfig, prevState, currState, true, false);
        configMock.setup(m => m.getIdentifier(requirementConfig.key)).returns(() => enabledTest);

        testObject.handleUpdate(currState);
        tearDownCallback(configMock.object, 0, requirementConfig);

        teardownMock.verify(m => m(enabledTest), Times.once());
    });

    test('teardown when a test is turned form enabled to disabled, without a requirement configuration', () => {
        const enabledTest = 'some test id';
        const prevState = {
            tests: {
                assessments: {},
            },
        } as VisualizationStoreData;
        const currState = {
            tests: {
                adhoc: {},
            },
        } as VisualizationStoreData;
        testObject.setPrevState(prevState);
        setupDefaultVisualizationConfigFactory();
        setupIsTestTerminated(configMock, undefined, prevState, currState, true, false);
        configMock.setup(m => m.getIdentifier(undefined)).returns(() => enabledTest);

        testObject.handleUpdate(currState);
        tearDownCallback(configMock.object, 0);

        teardownMock.verify(m => m(enabledTest), Times.once());
    });

    function setupDefaultVisualizationConfigFactory(): void {
        visualizationConfigurationFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(givenCallback => {
                tearDownCallback = givenCallback;
            });
    }

    function setupIsTestTerminated(
        configMock: IMock<VisualizationConfiguration>,
        requirementStub: Requirement,
        expectedPrevState: VisualizationStoreData,
        expectedCurrState: VisualizationStoreData,
        withPrevEnabled: boolean,
        withCurrEnabled: boolean,
    ): void {
        const prevScanStateStub = {} as ScanData;
        const currScanStateStub = {} as ScanData;
        configMock
            .setup(m => m.getStoreData(expectedPrevState.tests))
            .returns(() => prevScanStateStub);
        configMock
            .setup(m => m.getStoreData(expectedCurrState.tests))
            .returns(() => currScanStateStub);
        configMock
            .setup(m => m.getTestStatus(prevScanStateStub, requirementStub?.key))
            .returns(() => withPrevEnabled);
        configMock
            .setup(m => m.getTestStatus(currScanStateStub, requirementStub?.key))
            .returns(() => withCurrEnabled);
    }
});

class TestableAnalyzerStateUpdateHandler extends AnalyzerStateUpdateHandler {
    public setPrevState(prevState: VisualizationStoreData): void {
        this.prevState = prevState;
    }

    public getPrevState(): VisualizationStoreData {
        return this.prevState;
    }

    public getStartScanDelegate(): (id: string) => void {
        return this.startScan;
    }

    public getTeardownDelegate(): (id: string) => void {
        return this.teardown;
    }
}
