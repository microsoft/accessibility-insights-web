// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// .expand-collapse-all-button {
//     display: flex;
//     padding: unset;
//     padding-right: 27px !important;
//     padding-left: 1px !important;
//     margin-left: 1px !important;
//     margin-top: 2px !important;
//     font-weight: ;

import { makeStyles, tokens } from "@fluentui/react-components";


// }

export const useExpandCollapseAllButtonStyles = makeStyles({
    expandCollapseAllButton: {
        display: 'flex',
        padding: 'unset',
        paddingRight: '27px!important',
        paddingLeft: '1px!important',
        marginLeft: '1px!important',
        marginTop: '2px!important',
        fontWeight: tokens?.fontSizeBase400
    }
})
