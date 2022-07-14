// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

const d =
    'M16 11.2891V0.289062H-7.62939e-06V11.2891H1.99999V15L5.71093 11.2891H16ZM1 1.28906H15L15 10.2891H5.28906L3 ' +
    '12.5781V10.2891H1V1.28906ZM9.99999 6.28906H8.99999V4.28906H11V6.28906C11 6.42969 10.974 6.55859 10.9219 6.67969C10.8698 6.80078 ' +
    '10.7982 6.90625 10.707 6.99609C10.6159 7.08594 10.5104 7.16016 10.3906 7.21094C10.2708 7.26172 10.1406 7.28906 9.99999 ' +
    '7.28906V6.28906ZM4.99999 6.28906H5.99999V7.28906C6.14062 7.28906 6.27083 7.26172 6.39062 7.21094C6.51041 7.16016 6.61588 ' +
    '7.08594 6.70702 6.99609C6.79817 6.90625 6.86978 6.80078 6.92187 6.67969C6.97395 6.55859 6.99999 6.42969 6.99999 ' +
    '6.28906V4.28906H4.99999V6.28906Z';

export const CommentIcon = NamedFC('CommentIcon', () => (
    <svg
        width="17"
        height="16"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
    >
        <path fillRule="evenodd" clipRule="evenodd" d={d} fill="#737373" />
    </svg>
));
