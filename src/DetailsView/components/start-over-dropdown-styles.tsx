// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useStartOverDropdownStyles: any = makeStyles({
    menuButton: {
        alignItems: 'flex-start !important',
        fontWeight: '400 !important',
        color: tokens.colorNeutralForeground2,
        paddingLeft: '4px',

        ':focus': {
            border: `1px solid ${tokens.colorStrokeFocus2}`,
        },

        ':hover': {
            background: 'none !important',
            color: tokens.colorNeutralForeground2BrandHover,

            '& > span': {
                '& > svg': {
                    color: tokens.colorNeutralForeground2BrandHover,
                },
            },
        },
    },

    chevronIcon: {
        color: tokens.colorNeutralForeground2,

        ':hover': {
            background: 'none !important',
            color: tokens.colorNeutralForeground2BrandHover,
        },
    },

    defaultChevron: {
        color: `${tokens.colorNeutralStrokeAccessible} !important`,

        ':hover': {
            color: `unset !important`,
        },
    },

    menuPopover: {
        padding: 'unset !important',
        border: 'unset !important',
        borderRadius: 'unset !important',
    },

    menuItem: {
        paddingBottom: 'unset !important',
    },
});
