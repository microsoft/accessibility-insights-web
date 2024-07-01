// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const InsightsCommandButtonStyle = makeStyles({
    button: {
        fontWeight: tokens.fontWeightRegular,
        '&:hover': {
            color: 'red !imporant'
        }
    },
    buttonIcon: {
        color: tokens.colorCompoundBrandStrokeHover,
    },
});
