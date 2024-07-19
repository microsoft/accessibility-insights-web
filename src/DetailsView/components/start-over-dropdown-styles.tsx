// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, themeToTokensObject, tokens, webLightTheme } from '@fluentui/react-components';

export const StartOverDropdownStyles = makeStyles({

    menuButton: {
        alignItems: 'flex-start !important',
        fontWeight: '400 !important',
        marginLeft: '-8px !important',
        color: tokens.colorCompoundBrandStrokeHover,

        ':hover': {
            background: 'none !important',
            color: tokens.colorNeutralForeground2BrandHover,

            // '& > span': {
            //     '& > svg': {
            //         color: `${tokens.colorNeutralForeground2BrandHover}`,
            //     }
            // }
        }
    },

    menuPopover: {
        padding: 'unset !important',
        border: 'unset !important',
        borderRadius: 'unset !important',
    },

    menuItem: {
        paddingBottom: 'unset !important',

        '&:hover': {
            //background: 'none !important',
            // color: tokens.colorNeutralForeground2BrandHover,

            // & > span {
            //     & > svg {
            //         color: $insights-button-hover;
            //     }
            // }
        }
    }
});
