// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { makeStyles, tokens } from '@fluentui/react-components';

export const useExpandCollapseAllButtonStyles = makeStyles({
    expandCollapseAllButton: {
        display: 'flex',
        padding: 'unset',
        paddingRight: '27px!important',
        paddingLeft: '1px!important',
        marginLeft: '1px!important',
        marginTop: '2px!important',
        fontWeight: tokens?.fontSizeBase400,
    },

    customStyleIcon: {
        color: tokens.colorNeutralForeground2BrandHover,
    },
});
