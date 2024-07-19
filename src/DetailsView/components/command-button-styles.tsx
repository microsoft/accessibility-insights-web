// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, themeToTokensObject, tokens, webLightTheme } from '@fluentui/react-components';

export const CommandButtonStyle = makeStyles({
    assessmentButton: {
        fontWeight: '400 !important',
        paddingLeft: '5px !important',

        '&:hover': {
            background: 'none !important',
            color: tokens.colorNeutralForeground2BrandHover,
            '& > span': {
                '& >svg': {
                    color: tokens.colorNeutralForeground2BrandHover
                }
            }

        },
    },

    // arrowIconLight: {
    //     //color: themeToTokensObject(webLightTheme)?.colorCompoundBrandStrokeHover
    //     color: tokens?.colorCompoundBrandStrokeHover
    // },

    // arrowIconDark: {
    //     '&:hover': {
    //         //color: themeToTokensObject(webLightTheme)?.colorNeutralForeground2BrandHover
    //         color: tokens.colorNeutralForeground2BrandHover
    //     }
    // }
});
