// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { IPartialTabOrderPropertyBag, ITabOrderPropertyBag } from './tab-order-property-bag';

// tslint:disable-next-line:interface-name
export interface IVisualizationPropertyBag<T> extends IAssessmentVisualizationInstance {
    propertyBag?: T;
}

// tslint:disable-next-line:interface-name
export type IVisualizationInstanceProcessorCallback<Raw, Processed> = (
    instances: IVisualizationPropertyBag<Raw>[],
) => IVisualizationPropertyBag<Processed>[];

// tslint:disable-next-line:interface-name
export type IPropertyBags = IPartialTabOrderPropertyBag | ITabOrderPropertyBag;

export class VisualizationInstanceProcessor {
    public static nullProcessor: IVisualizationInstanceProcessorCallback<null, null> = instances => {
        return instances;
    };

    public static addOrder: IVisualizationInstanceProcessorCallback<IPartialTabOrderPropertyBag, ITabOrderPropertyBag> = instances => {
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
