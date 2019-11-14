// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { getDefaultFeatureFlagValues } from '../../../../common/feature-flags';
import { VisualizationType } from '../../../../common/types/visualization-type';
import {
    DrawingController,
    VisualizationWindowMessage,
} from '../../../../injected/drawing-controller';
import { DrawingInitiator } from '../../../../injected/drawing-initiator';
import { AssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import {
    PropertyBags,
    VisualizationInstanceProcessorCallback,
} from '../../../../injected/visualization-instance-processor';
import { DictionaryStringTo } from '../../../../types/common-types';

class DrawingControllerStub extends DrawingController {
    public processRequest = (message: VisualizationWindowMessage): void => {};
}

describe('DrawingInitiatorTest', () => {
    let drawingControllerMock: IMock<DrawingController>;
    let processorMock: IMock<VisualizationInstanceProcessorCallback<
        PropertyBags,
        PropertyBags
    >>;
    let testObject: DrawingInitiator;

    beforeEach(() => {
        processorMock = Mock.ofInstance(() => null);
        drawingControllerMock = Mock.ofType(
            DrawingControllerStub,
            MockBehavior.Strict,
        );
        testObject = new DrawingInitiator(drawingControllerMock.object);
    });

    function verifyAll(): void {
        processorMock.verifyAll();
        drawingControllerMock.verifyAll();
    }

    test('enableVisualization', () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';
        const selectorMap: DictionaryStringTo<AssessmentVisualizationInstance> = {
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
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.enableVisualization(
            visualizationType,
            getDefaultFeatureFlagValues(),
            selectorMap,
            configId,
            processorMock.object,
        );

        verifyAll();
    });

    test('disableVisualization', () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';
        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: false,
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };

        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.disableVisualization(
            visualizationType,
            getDefaultFeatureFlagValues(),
            configId,
        );

        verifyAll();
    });

    test('enableVisualiztion: selectorMap is null', () => {
        const visualizationType = -1 as VisualizationType;
        const step = null;
        const featureFlagStoreData = {};

        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .verifiable(Times.never());

        testObject.enableVisualization(
            visualizationType,
            featureFlagStoreData,
            null,
            step,
            processorMock.object,
        );

        verifyAll();
    });

    test('enableVisualization: selectorMap is empty', () => {
        const visualizationType = -1 as VisualizationType;
        const configId = 'id';

        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: true,
            elementResults: [],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.enableVisualization(
            visualizationType,
            getDefaultFeatureFlagValues(),
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
