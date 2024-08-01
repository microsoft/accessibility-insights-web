// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useCommandButtonStyle: any = makeStyles<any>({
    assessmentButton: {
        fontWeight: '400 !important',
        paddingLeft: '5px !important',

        ':focus': {
            border: `1px solid ${tokens.colorStrokeFocus2}`,
        },

        '&:hover': {
            background: 'none !important',
            color: tokens.colorNeutralForeground2BrandHover,
            '& > span': {
                '& >svg': {
                    color: tokens.colorNeutralForeground2BrandHover,
                },
            },
        },
    },
});
