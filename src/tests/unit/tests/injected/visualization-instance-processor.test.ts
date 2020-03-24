// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import {
    PartialTabOrderPropertyBag,
    TabOrderPropertyBag,
} from '../../../../injected/tab-order-property-bag';
import {
    VisualizationInstanceProcessor,
    VisualizationPropertyBag,
} from '../../../../injected/visualization-instance-processor';

describe('VisualizationInstanceProcessorTest', () => {
    test('nullProcessor', () => {
        const instancesStub = [{} as AssessmentVisualizationInstance];
        expect(VisualizationInstanceProcessor.nullProcessor(instancesStub)).toMatchObject(
            instancesStub,
        );
    });

    test('addOrder', () => {
        const initialInstances: VisualizationPropertyBag<PartialTabOrderPropertyBag>[] = [
            {
                ...createNullifiedAssessmenVisualizationInstance(),
                propertyBag: {
                    timestamp: 20,
                },
            },
            {
                ...createNullifiedAssessmenVisualizationInstance(),
                propertyBag: {
                    timestamp: 10,
                },
            },
        ];
        const expectedInstances: VisualizationPropertyBag<TabOrderPropertyBag>[] = [
            {
                ...createNullifiedAssessmenVisualizationInstance(),
                propertyBag: {
                    timestamp: 10,
                    tabOrder: 1,
                },
            },
            {
                ...createNullifiedAssessmenVisualizationInstance(),
                propertyBag: {
                    timestamp: 20,
                    tabOrder: 2,
                },
            },
        ];

        const actual = VisualizationInstanceProcessor.addOrder(initialInstances);

        expect(actual).toEqual(expectedInstances);
    });

    function createNullifiedAssessmenVisualizationInstance(): AssessmentVisualizationInstance {
        return {
            isFailure: false,
            isVisualizationEnabled: false,
            ruleResults: null,
            target: null,
        };
    }
});
