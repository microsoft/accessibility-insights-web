// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { propertyBagColumnRenderer } from './property-bag-column-renderer';
import * as React from 'react';

export class PropertyBagColumnRendererFactory {
    public static getRenderer<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: InstanceTableRow<TPropertyBag>) => JSX.Element {
        return item => {
            return propertyBagColumnRenderer(item, configs);
        };
    }
}

export class PropertyBagColumnRendererWithComputationFactory {
    public static getRenderer<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: InstanceTableRow<TPropertyBag>) => JSX.Element {
        return item => {
            return propertyBagColumnRendererWithComputation(item, configs);
        };
    }
}

export function propertyBagColumnRendererWithComputation<TPropertyBag extends ColumnValueBag>(
    item: InstanceTableRow<TPropertyBag>,
    configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
): JSX.Element {
    const mapper = (config: PropertyBagColumnRendererConfig<TPropertyBag>, index: number) => {
        if (item.instance.propertyBag == null) {
            return null;
        }
        if (config.compute == null) {
            return null;
        }
        if (
            config.neededPropertyBagValues.some(
                key => item.instance.propertyBag.hasOwnProperty(key) === false,
            ) &&
            config.defaultValue == null
        ) {
            return null;
        }
        return render(config, index);
    };

    const render = (config: PropertyBagColumnRendererConfig<TPropertyBag>, index: number) => {
        console.log(item.instance);
        const ValueComponent = config.compute(item.instance.propertyBag);
        console.log('get by calling compute', ValueComponent);
        return (
            <div key={`property-${index}`} className="property-bag-div">
                <span className="display-name">{`${config.displayName}: `}</span>
                <ValueComponent />
            </div>
        );
    };

    return <div className="property-bag-container">{configs.map(mapper)}</div>;
}
