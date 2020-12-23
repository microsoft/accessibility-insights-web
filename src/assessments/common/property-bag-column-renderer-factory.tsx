// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { AssessmentInstanceRowData } from 'DetailsView/components/assessment-instance-table';
import { propertyBagColumnRenderer } from './property-bag-column-renderer';

export class PropertyBagColumnRendererFactory {
    public static getRenderer<TPropertyBag extends ColumnValueBag>(
        configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: AssessmentInstanceRowData<TPropertyBag>) => JSX.Element {
        return item => {
            return propertyBagColumnRenderer(item, configs);
        };
    }
}
