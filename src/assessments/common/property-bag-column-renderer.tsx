// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { DictionaryStringTo } from 'types/common-types';

export function propertyBagColumnRenderer<TPropertyBag extends ColumnValueBag>(
    item: InstanceTableRow<TPropertyBag>,
    configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
): JSX.Element {
    const mapper = (config: PropertyBagColumnRendererConfig<TPropertyBag>, index: number) => {
        if (item.instance.propertyBag == null) {
            return null;
        }
        const value = item.instance.propertyBag[config.propertyName];
        if (value == null && config.defaultValue == null) {
            return null;
        }

        return render(config, value, index);
    };

    const render = (
        config: PropertyBagColumnRendererConfig<TPropertyBag>,
        value: any,
        index: number,
    ) => {
        return (
            <div key={`property-${index}`} className="property-bag-div">
                <span className="display-name">{`${config.displayName}: `}</span>
                {renderValue(config, value)}
            </div>
        );
    };

    const renderValue = (config: PropertyBagColumnRendererConfig<TPropertyBag>, value: any) => {
        if (config.expand) {
            return renderProperties(config, value);
        }

        return <React.Fragment>{value || config.defaultValue}</React.Fragment>;
    };

    const renderProperties = (
        config: PropertyBagColumnRendererConfig<TPropertyBag>,
        propertyMap: DictionaryStringTo<string>,
    ) => {
        if (isEmpty(propertyMap)) {
            return <React.Fragment>{config.defaultValue}</React.Fragment>;
        }

        return Object.keys(propertyMap).map(key => {
            return (
                <div key={key} className="expanded-property-div">
                    {renderInnerKeyValue(key, propertyMap[key])}
                </div>
            );
        });
    };

    const renderInnerKeyValue = (key: string, value: string) => {
        if (value === null) {
            return <span className="display-name">{`${key}`}</span>;
        } else {
            return (
                <React.Fragment>
                    <span className="display-name">{`${key}: `}</span>
                    {value}
                </React.Fragment>
            );
        }
    };

    return <div className="property-bag-container">{configs.map(mapper)}</div>;
}
