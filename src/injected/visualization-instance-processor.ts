// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { IPartialTabOrderPropertyBag, ITabOrderPropertyBag } from './tab-order-property-bag';

export interface VisualizationPropertyBag<T> extends IAssessmentVisualizationInstance {
    propertyBag?: T;
}

export type VisualizationInstanceProcessorCallback<Raw, Processed> = (
    instances: VisualizationPropertyBag<Raw>[],
) => VisualizationPropertyBag<Processed>[];

export type PropertyBags = IPartialTabOrderPropertyBag | ITabOrderPropertyBag;

export class VisualizationInstanceProcessor {
    public static nullProcessor: VisualizationInstanceProcessorCallback<null, null> = instances => {
        return instances;
    };

    public static addOrder: VisualizationInstanceProcessorCallback<IPartialTabOrderPropertyBag, ITabOrderPropertyBag> = instances => {
        instances.sort((instanceA, instanceB) => instanceA.propertyBag.timestamp - instanceB.propertyBag.timestamp);
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
