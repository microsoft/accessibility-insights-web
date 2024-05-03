// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { NamedFC } from 'common/react/named-fc';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { DictionaryStringTo } from 'types/common-types';
import { Term } from 'assessments/markup';
import { PropertyBagColumnRenderer } from 'assessments/common/property-bag-column-renderer';

export class PropertyBagComponentColumnRenderer<
    TPropertyBag extends ColumnValueBag,
> extends PropertyBagColumnRenderer<TPropertyBag> {
    private render = (
        config: PropertyBagColumnRendererConfig<TPropertyBag>,
        value: any,
        index: number,
    ) => {
        return (
            <div key={`property-${index}`} className="property-bag-div">
                <span className="display-name">{`${config.displayName}: `}</span>
                {this.renderValue(config, value)}
            </div>
        );
    };

    private mapper = (config: PropertyBagColumnRendererConfig<TPropertyBag>, index: number) => {
        if (this.item.instance.propertyBag == null) {
            return null;
        }
        const value = this.item.instance.propertyBag[config.propertyName];
        if (value == null && config.defaultValue == null) {
            return null;
        }

        return this.render(config, value, index);
    };

    protected renderValue = (config: PropertyBagColumnRendererConfig<TPropertyBag>, value: any) => {
        if (config.expand) {
            return this.renderProperties(config, value);
        }
        return <React.Fragment>{() => value}</React.Fragment>;
        // const valueToRender = value || config.defaultValue;
        // if (typeof valueToRender === 'string') {
        //     return <React.Fragment>{valueToRender}</React.Fragment>;
        // }

        // const ValueComponent = valueToRender;
        // console.log(ValueComponent, <ValueComponent />);
        // return (
        //     <React.Fragment>
        //         Hello, this is a <Emphasis>test</Emphasis>
        //     </React.Fragment>
        // );
    };

    private renderProperties = (
        config: PropertyBagColumnRendererConfig<TPropertyBag>,
        propertyMap: DictionaryStringTo<string>,
    ) => {
        if (isEmpty(propertyMap)) {
            return <React.Fragment>{config.defaultValue}</React.Fragment>;
        }

        return Object.keys(propertyMap).map(key => {
            return (
                <div key={key} className="expanded-property-div">
                    {this.renderInnerKeyValue(key, propertyMap[key])}
                </div>
            );
        });
    };

    private renderInnerKeyValue = (key: string, value: string) => {
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

    public getRenderer = (): JSX.Element => {
        return <div className="property-bag-container">{this.configs.map(this.mapper)}</div>;
    };
}
