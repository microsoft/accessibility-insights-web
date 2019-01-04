// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from '../../common/types/property-bag/column-value-bag';
import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { customWidgetsColumnRenderer } from './custom-widgets-column-renderer';
import { IPropertyBagColumnRendererConfig } from '../common/property-bag-column-renderer';

export class CustomWidgetsColumnRendererFactory {
    public static getWithLink<TPropertyBag extends ColumnValueBag>(
        configs: IPropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: IAssessmentInstanceRowData<TPropertyBag>) => JSX.Element {

        return item => {
            return customWidgetsColumnRenderer(item, configs, true);
        };
    }

    public static getWithoutLink<TPropertyBag extends ColumnValueBag>(
        configs: IPropertyBagColumnRendererConfig<TPropertyBag>[],
    ): (item: IAssessmentInstanceRowData<TPropertyBag>) => JSX.Element {

        return item => {
            return customWidgetsColumnRenderer(item, configs, false);
        };
    }
}
