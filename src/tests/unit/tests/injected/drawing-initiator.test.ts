// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getDefaultFeatureFlagsWeb } from 'common/feature-flags';
import { VisualizationType } from 'common/types/visualization-type';
import { DrawingController, VisualizationWindowMessage } from 'injected/drawing-controller';
import { DrawingInitiator } from 'injected/drawing-initiator';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { VisualizationInstanceProcessorCallback } from 'injected/visualization-instance-processor';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

class DrawingControllerStub extends DrawingController {
    public processRequest = async (message: VisualizationWindowMessage): Promise<void> => {};
}

describe('DrawingInitiatorTest', () => {
    let drawingControllerMock: IMock<DrawingController>;
    let processorMock: IMock<VisualizationInstanceProcessorCallback>;
    let testObject: DrawingInitiator;

    beforeEach(() => {
        processorMock = Mock.ofInstance(() => null);
        drawingControllerMock = Mock.ofType(DrawingControllerStub, MockBehavior.Strict);
        testObject = new DrawingInitiator(drawingControllerMock.object);
    });

    function verifyAll(): void {
        processorMock.verifyAll();
        drawingControllerMock.verifyAll();
    }

    test('enableVisualization', async () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';
        const selectorMap: SelectorToVisualizationMap = {
            key1: {
                target: ['element1'],
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
            },
            key2: {
                target: ['element2'],
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
            },
        };

        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: true,
            elementResults: [
                {
                    isFailure: false,
                    isVisualizationEnabled: false,
                    target: ['element1'],
                    targetIndex: 0,
                    ruleResults: null,
                },
                {
                    isFailure: false,
                    isVisualizationEnabled: false,
                    target: ['element2'],
                    targetIndex: 0,
                    ruleResults: null,
                },
            ],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        await testObject.enableVisualization(
            visualizationType,
            getDefaultFeatureFlagsWeb(),
            selectorMap,
            configId,
            processorMock.object,
        );

        verifyAll();
    });

    test('disableVisualization', async () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';
        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: false,
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
            configId: configId,
        };

        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        await testObject.disableVisualization(
            visualizationType,
            getDefaultFeatureFlagsWeb(),
            configId,
        );

        verifyAll();
    });

    test('enableVisualiztion: selectorMap is null', async () => {
        const visualizationType = -1 as VisualizationType;
        const step = null;
        const featureFlagStoreData = {};

        drawingControllerMock.setup(x => x.processRequest(It.isAny())).verifiable(Times.never());

        await testObject.enableVisualization(
            visualizationType,
            featureFlagStoreData,
            null,
            step,
            processorMock.object,
        );

        verifyAll();
    });

    test('enableVisualization: selectorMap is empty', async () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';

        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: true,
            elementResults: [],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        await testObject.enableVisualization(
            visualizationType,
            getDefaultFeatureFlagsWeb(),
            {},
            configId,
            processorMock.object,
        );

        verifyAll();
    });

    function setupProcessorMock(): void {
        processorMock
            .setup(pm => pm(It.isAny()))
            .returns(instances => instances)
            .verifiable(Times.once());
    }
});
