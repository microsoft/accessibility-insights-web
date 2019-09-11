// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-sfc';

const d =
    'M14 6.28906V16H4V13H0V0H6.71094L9.71094 3H10.7109L14 6.28906ZM11 6H12.2891L11 4.71094V6ZM4 3H8.28906L6.28906 1H1V12H4V3ZM13 ' +
    '7H10V4H5V15H13V7Z';

export const CopyIcon = NamedFC('CopyIcon', () => (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path d={d} />
    </svg>
));
