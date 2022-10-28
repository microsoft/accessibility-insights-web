// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { NewTabLink } from 'common/components/new-tab-link';

import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import { PropertyBagColumnRendererFactory } from '../common/property-bag-column-renderer-factory';

export function customWidgetsColumnRenderer<TPropertyBag extends ColumnValueBag>(
    item: InstanceTableRow<any>,
    configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
    includeLink: boolean,
): JSX.Element {
    const mapDesignPatterns = (pattern: DesignPattern) => {
        return (
            <div key={`pattern-${pattern.designPattern}`} className="expanded-property-div">
                {includeLink
                    ? renderDesignPatternWithLink(pattern)
                    : renderDesignPatternWithoutLink(pattern)}
            </div>
        );
    };
    const propertyBag = item.instance.propertyBag;

    if (propertyBag.role in roleToDesignPatternsMapping) {
        const patterns = roleToDesignPatternsMapping[propertyBag.role];
        propertyBag.designPattern = patterns.map(mapDesignPatterns);
    }

    const propertyBagRenderer = PropertyBagColumnRendererFactory.getRenderer<TPropertyBag>(configs);

    return propertyBagRenderer(item);
}

function renderDesignPatternWithLink(pattern: DesignPattern): JSX.Element {
    return <NewTabLink href={pattern.URL}>{pattern.designPattern}</NewTabLink>;
}

function renderDesignPatternWithoutLink(pattern: DesignPattern): JSX.Element {
    return <span className="display-name">{pattern.designPattern}</span>;
}

export function getFlatDesignPatternStringFromRole(role: string): string | null {
    if (!roleToDesignPatternsMapping[role]) {
        return null;
    }
    return makeFlatDesignPatternString(roleToDesignPatternsMapping[role]);
}

function makeFlatDesignPatternString(patterns: DesignPattern[]): string {
    return patterns.map(pat => pat.designPattern).join(', ');
}

const roleToDesignPatternsMapping: DictionaryStringTo<DesignPattern[]> = {
    alert: [{ designPattern: 'Alert', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert' }],
    alertdialog: [
        {
            designPattern: 'Alert or Message Dialog',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog',
        },
    ],
    button: [
        {
            designPattern: 'Accordion',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion',
        },
        { designPattern: 'Button', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/button' },
        {
            designPattern: 'Disclosure (Show/Hide)',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure',
        },
        {
            designPattern: 'Menu Button',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubutton',
        },
    ],
    checkbox: [
        {
            designPattern: 'Checkbox',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox',
        },
    ],
    combobox: [
        {
            designPattern: 'Combo Box',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox',
        },
    ],
    dialog: [
        {
            designPattern: 'Dialog (Modal)',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal',
        },
    ],
    feed: [{ designPattern: 'Feed', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed' }],
    grid: [{ designPattern: 'Grid', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid' }],
    link: [{ designPattern: 'Link', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/link' }],
    listbox: [
        { designPattern: 'Listbox', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox' },
    ],
    menu: [{ designPattern: 'Menu', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu' }],
    menubar: [{ designPattern: 'Menu Bar', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu' }],
    radiogroup: [
        {
            designPattern: 'Radio Group',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton',
        },
    ],
    separator: [
        {
            designPattern: 'Window Splitter',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter',
        },
    ],
    slider: [
        { designPattern: 'Slider', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider' },
        {
            designPattern: 'Slider (Multi-thumb)',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb',
        },
    ],
    spinbutton: [
        {
            designPattern: 'Spinbutton',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton',
        },
    ],
    tablist: [{ designPattern: 'Tabs', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel' }],
    toolbar: [
        { designPattern: 'Toolbar', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar' },
    ],
    tooltip: [
        { designPattern: 'Tooltip', URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip' },
    ],
    tree: [
        {
            designPattern: 'Tree View',
            URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview',
        },
    ],
};
