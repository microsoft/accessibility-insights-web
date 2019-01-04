// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from '../../common/types/property-bag/column-value-bag';
import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { IPropertyBagColumnRendererConfig, propertyBagColumnRenderer } from './property-bag-column-renderer';

export class PropertyBagColumnRendererFactory {
    public static get<TPropertyBag extends ColumnValueBag>(
        configs: IPropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: IAssessmentInstanceRowData<TPropertyBag>) => JSX.Element {

        return item => {
            return propertyBagColumnRenderer(item, configs);
        };
    }
}
