// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { targetSizeColumnRenderer } from 'assessments/pointer-motion/target-size-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';

export class TargetSizeColumnRendererFactory {
    public static getColumnComponent<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: InstanceTableRow<TPropertyBag>) => JSX.Element {
        return item => {
            return targetSizeColumnRenderer(item, configs);
        };
    }
}
