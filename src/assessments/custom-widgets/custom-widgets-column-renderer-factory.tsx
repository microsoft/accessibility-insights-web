// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { customWidgetsColumnRenderer } from './custom-widgets-column-renderer';

export class CustomWidgetsColumnRendererFactory {
    public static getWithLink<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: InstanceTableRow<TPropertyBag>) => JSX.Element {
        return item => {
            return customWidgetsColumnRenderer(item, configs, true);
        };
    }

    public static getWithoutLink<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: InstanceTableRow<TPropertyBag>) => JSX.Element {
        return item => {
            return customWidgetsColumnRenderer(item, configs, false);
        };
    }
}
