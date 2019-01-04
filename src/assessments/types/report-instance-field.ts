// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValue, ColumnValueBag, isScalarColumnValue } from '../../common/types/property-bag/column-value-bag';
import { TestStepInstance } from '../../common/types/store-data/iassessment-result-data';
import { IPropertyBagColumnRendererConfig } from '../common/property-bag-column-renderer';

export type ReportInstanceField = {
    key: string,
    label: string,
    getValue: (instance: Partial<TestStepInstance>) => ColumnValue,
};
export type ReportInstanceFieldMap = {
    [KEY in string]?: ReportInstanceField;
};

export type ReportInstanceFields = ReportInstanceField[];

type HasPropertyBag<PB> = { propertyBag: PB };

function fromPropertyBagField<PB>(label: string, key: keyof PB & string): ReportInstanceField {
    function getValue(i: HasPropertyBag<PB>): string {
        return i.propertyBag && i.propertyBag[key] && i.propertyBag[key].toString();
    }
    return { key, label, getValue };
}

function fromColumnValueBagField<PB extends ColumnValueBag>(
    label: string,
    key: keyof PB & string,
    defaultValue = '-',
): ReportInstanceField {
    function getValue(i: HasPropertyBag<PB>) {
        const value = i.propertyBag && i.propertyBag[key];
        return isValid(value) ? value : defaultValue;
    }

    return { key, label, getValue };
}

function fromPropertyBagFunction<PB>(label: string, key: string, accessor: (bag: PB) => string): ReportInstanceField {
    function getValue(i: HasPropertyBag<PB>) {
        return i.propertyBag && accessor(i.propertyBag);
    }
    return { key, label, getValue };
}

const common: ReportInstanceFieldMap = {
    comment: { key: 'comment', label: 'Comment', getValue: i => i.description },
    snippet: { key: 'snippet', label: 'Snippet', getValue: i => i.html },
    path: { key: 'path', label: 'Path', getValue: i => i.target && i.target.join(', ') },
};

function isValid(value: ColumnValue): ColumnValue {
    if (!value) {
        return false;
    }
    if (!isScalarColumnValue(value) && Object.keys(value).length === 0) {
        return false;
    }
    return true;
}

function fromColumns<T extends ColumnValueBag>(cfg: IPropertyBagColumnRendererConfig<T>[]) {

    return cfg.map(fromColumnConfig);

    function fromColumnConfig({
        propertyName,
        defaultValue,
        displayName,
    }: IPropertyBagColumnRendererConfig<T>): ReportInstanceField {


        const getValue = (inst: HasPropertyBag<T>) => {
            const value = inst.propertyBag && inst.propertyBag[propertyName];
            return isValid(value) ? value : defaultValue;
        };

        return {
            key: propertyName,
            label: displayName,
            getValue,
        };
    }
}

export const ReportInstanceField = {
    fromPropertyBagField,
    fromColumnValueBagField,
    fromPropertyBagFunction,
    fromColumns,
    common,
};
