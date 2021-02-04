// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { LandmarkTestStep } from 'assessments/landmarks/test-steps/test-steps';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { VisualizationStoreData } from '../../../../common/types/store-data/visualization-store-data';
import { AnalyzerStateUpdateHandler } from '../../../../injected/analyzer-state-update-handler';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('AnalyzerStateUpdateHandlerTest', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let startScanMock: IMock<(id) => void>;
    let teardownMock: IMock<(id) => void>;
    let testObject: TestableAnalyzerStateUpdateHandler;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
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

    test('do not start scan if nothing is scanning', () => {
        const state = new VisualizationStoreDataBuilder().withLandmarksEnable().build();

        startScanMock.setup(start => start(It.isAny())).verifiable(Times.never());

        testObject.handleUpdate(state);

        startScanMock.verifyAll();
    });

    test('do not start scan if inject in progress', () => {
        const state = new VisualizationStoreDataBuilder()
            .with('scanning', 'landmarks')
            .with('injectingRequested', true)
            .withLandmarksEnable()
            .build();

        startScanMock.setup(start => start(It.isAny())).verifiable(Times.never());

        testObject.handleUpdate(state);

        startScanMock.verifyAll();
    });

    test('do not start scan if state is not changed', () => {
        const prevState = new VisualizationStoreDataBuilder()
            .with('scanning', 'landmarks')
            .withLandmarksEnable()
            .build();
        const newState = prevState;
        testObject.setPrevState(prevState);
        startScanMock.setup(start => start(It.isAny())).verifiable(Times.never());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(newState);

        startScanMock.verifyAll();
    });

    test('start scan: prev state is null', () => {
        const enabledStep = HeadingsTestStep.headingFunction;
        const state = new VisualizationStoreDataBuilder()
            .with('scanning', HeadingsTestStep.headingFunction)
            .withHeadingsAssessment(true, enabledStep)
            .build();
        startScanMock
            .setup(start => start(HeadingsTestStep.headingFunction))
            .verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(state);

        startScanMock.verifyAll();
    });

    test('start scan: inject just completed', () => {
        const enabledStep = HeadingsTestStep.headingFunction;
        const prevState = new VisualizationStoreDataBuilder()
            .with('injectingRequested', true)
            .with('scanning', enabledStep)
            .withHeadingsAssessment(true, enabledStep)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .with('scanning', enabledStep)
            .withHeadingsAssessment(true, enabledStep)
            .build();
        testObject.setPrevState(prevState);
        startScanMock.setup(start => start(enabledStep)).verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        startScanMock.verifyAll();
    });

    test('start scan: headings assessment just got enabled', () => {
        const enabledStep = HeadingsTestStep.headingFunction;
        const prevState = new VisualizationStoreDataBuilder().build();
        const currState = new VisualizationStoreDataBuilder()
            .with('scanning', enabledStep)
            .withHeadingsAssessment(true, enabledStep)
            .build();
        testObject.setPrevState(prevState);
        startScanMock.setup(start => start(enabledStep)).verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        startScanMock.verifyAll();
    });

    test('do not terminate anything if prev state is null', () => {
        const currState = new VisualizationStoreDataBuilder().build();

        teardownMock.setup(teardown => teardown(It.isAny())).verifiable(Times.never());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        teardownMock.verifyAll();
    });

    test('teardown when a test is turned form enabled to disabled', () => {
        const enabledStep = HeadingsTestStep.headingFunction;
        const prevState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, enabledStep)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(false, enabledStep)
            .build();
        testObject.setPrevState(prevState);
        teardownMock.setup(teardown => teardown(enabledStep)).verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        teardownMock.verifyAll();
    });

    test('teardown when enabled step is changed', () => {
        const prevEnabledStep = HeadingsTestStep.headingFunction;
        const currEnabledStep = HeadingsTestStep.headingLevel;
        const prevState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, prevEnabledStep)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(false, prevEnabledStep)
            .withHeadingsAssessment(true, currEnabledStep)
            .build();
        testObject.setPrevState(prevState);
        teardownMock.setup(teardown => teardown(prevEnabledStep)).verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        teardownMock.verifyAll();
    });

    test('both test and step get changed', () => {
        const prevEnabledStep = LandmarkTestStep.landmarkRoles;
        const currEnabledStep = HeadingsTestStep.headingLevel;
        const prevState = new VisualizationStoreDataBuilder()
            .withLandmarksAssessment(true, prevEnabledStep)
            .build();
        const currState = new VisualizationStoreDataBuilder()
            .with('scanning', currEnabledStep)
            .withLandmarksAssessment(false, prevEnabledStep)
            .withHeadingsAssessment(true, currEnabledStep)
            .build();
        testObject.setPrevState(prevState);
        startScanMock.setup(start => start(currEnabledStep)).verifiable(Times.once());
        teardownMock.setup(teardown => teardown(prevEnabledStep)).verifiable(Times.once());
        setupDefaultVisualizationConfigFactory();

        testObject.handleUpdate(currState);

        teardownMock.verifyAll();
        startScanMock.verifyAll();
    });

    function setupDefaultVisualizationConfigFactory(): void {
        visualizationConfigurationFactoryMock
            .setup(vcfm => vcfm.getConfiguration(It.isAnyNumber()))
            .returns(test => new WebVisualizationConfigurationFactory().getConfiguration(test));
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
