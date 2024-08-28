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
            outline: '1px solid'
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
        borderRadius: tokens.borderRadiusNone,
    },

    menuItem: {
        borderRadius: tokens.borderRadiusNone,

        ':hover': {
            backgroundColor: 'unset !important',
        },
    },
});
