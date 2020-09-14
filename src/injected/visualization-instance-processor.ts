// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

export type VisualizationInstanceProcessorCallback = (
    instances: AssessmentVisualizationInstance[],
) => AssessmentVisualizationInstance[];

export class VisualizationInstanceProcessor {
    public static nullProcessor: VisualizationInstanceProcessorCallback = instances => {
        return instances;
    };

    public static addOrder: VisualizationInstanceProcessorCallback = instances => {
        instances.sort(
            (instanceA, instanceB) =>
                instanceA.propertyBag.timestamp - instanceB.propertyBag.timestamp,
        );
        return instances.map((instance, index) => {
            return {
                ...instance,
                propertyBag: {
                    ...instance.propertyBag,
                    tabOrder: index + 1,
                },
            };
        });
    };
}
