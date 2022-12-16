// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ColumnValue,
    ColumnValueBag,
    isScalarColumnValue,
} from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { TestStepInstance } from 'common/types/store-data/assessment-result-data';

export type ReportInstanceField<Instance = Partial<TestStepInstance>> = {
    key: string;
    label: string;
    getValue: (instance: Instance) => ColumnValue;
};

export type ReportInstanceFieldMap = { [KEY in string]?: ReportInstanceField };

export type ReportInstanceFields = ReportInstanceField[];

type HasPropertyBag<PB> = { propertyBag: PB };

function fromPropertyBagField<PB>(
    label: string,
    key: keyof PB & string,
): ReportInstanceField<HasPropertyBag<PB>> {
    function getValue(i: HasPropertyBag<PB>): ColumnValue {
        return i.propertyBag && i.propertyBag[key] && (i.propertyBag[key] as any).toString();
    }
    return { key, label, getValue };
}

function fromColumnValueBagField<PB extends ColumnValueBag>(
    label: string,
    key: keyof PB & string,
    defaultValue = '-',
): ReportInstanceField<HasPropertyBag<PB>> {
    function getValue(i: HasPropertyBag<PB>): ColumnValue {
        const value = i.propertyBag && i.propertyBag[key];
        return isValid(value) ? value : defaultValue;
    }

    return { key, label, getValue };
}

function fromPropertyBagFunction<PB>(
    label: string,
    key: string,
    accessor: (bag: PB) => string | null,
): ReportInstanceField<HasPropertyBag<PB>> {
    function getValue(i: HasPropertyBag<PB>): ColumnValue {
        return i.propertyBag && accessor(i.propertyBag);
    }
    return { key, label, getValue };
}

const common: ReportInstanceFieldMap = {
    comment: { key: 'comment', label: 'Comment', getValue: i => i.description },
    snippet: { key: 'snippet', label: 'Snippet', getValue: i => i.html },
    path: { key: 'path', label: 'Path', getValue: i => i.target && i.target.join(', ') },
    manualSnippet: { key: 'manualSnippet', label: 'Code Snippet', getValue: i => i.html },
    manualPath: { key: 'manualPath', label: 'CSS Selector', getValue: i => i.selector },
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

function fromColumns<PB extends ColumnValueBag>(
    cfg: PropertyBagColumnRendererConfig<PB>[],
): ReportInstanceField[] {
    return cfg.map(fromColumnConfig);

    function fromColumnConfig({
        propertyName,
        defaultValue,
        displayName,
    }: PropertyBagColumnRendererConfig<PB>): ReportInstanceField<HasPropertyBag<PB>> {
        function getValue(i: HasPropertyBag<PB>): ColumnValue {
            const value = i.propertyBag && i.propertyBag[propertyName];
            return isValid(value) ? value : defaultValue;
        }

        return {
            key: propertyName,
            label: displayName,
            getValue,
        };
    }
}

function fromSnippet(key: string, label: string): ReportInstanceField {
    return { key, label, getValue: i => i.html };
}

export const ReportInstanceField = {
    fromPropertyBagField,
    fromColumnValueBagField,
    fromPropertyBagFunction,
    fromColumns,
    fromSnippet,
    common,
};
