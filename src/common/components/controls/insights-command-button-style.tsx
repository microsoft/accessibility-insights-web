// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useInsightsCommandButtonStyle = makeStyles({
    button: {
        fontWeight: tokens?.fontWeightRegular,
    },

    menuItem: {
        border: 'unset !important',
    },

    buttonIcon: {
        //color: tokens?.colorCompoundBrandStrokeHover,
    },
});
