// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { PartialTabOrderPropertyBag, TabOrderPropertyBag } from './tab-order-property-bag';

export interface VisualizationPropertyBag<T> extends AssessmentVisualizationInstance {
    propertyBag?: T;
}

export type VisualizationInstanceProcessorCallback<Raw, Processed> = (
    instances: VisualizationPropertyBag<Raw>[],
) => VisualizationPropertyBag<Processed>[];

export type PropertyBags = PartialTabOrderPropertyBag | TabOrderPropertyBag;

export class VisualizationInstanceProcessor {
    public static nullProcessor: VisualizationInstanceProcessorCallback<null, null> = instances => {
        return instances;
    };

    public static addOrder: VisualizationInstanceProcessorCallback<
        PartialTabOrderPropertyBag,
        TabOrderPropertyBag
    > = instances => {
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
