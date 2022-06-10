// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption, IDropdownProps } from '@fluentui/react';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';

export type InsightsDropdownProps = IDropdownProps & {
    selectedKey: string | number | null;
};

export const InsightsDropdown = NamedFC<InsightsDropdownProps>('InsightsDropdown', props => {
    const { options, selectedKey } = props;

    const addSelectedToAriaLabel = (option: IDropdownOption): IDropdownOption => {
        const isSelected = selectedKey === option.key;
        const screenreaderText = option.ariaLabel ?? option.text;
        return { ...option, ariaLabel: isSelected ? `${screenreaderText} selected` : undefined };
    };

    const modifiedProps = {
        ...props,
        options: options.map(addSelectedToAriaLabel),
    };

    return <Dropdown {...modifiedProps} />;
});
