// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

const d =
    'M7.99121 7L14 13.0088L13.0088 14L7 7.99121L0.991211 14L0 13.0088L6.00879 7L0 0.991211L0.991211 0L7 6.00879L13.0088 0L14 ' +
    '0.991211L7.99121 7Z';

export const CancelIcon = NamedFC('CancelIcon', () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
    >
        <path d={d} fill="black" fillOpacity="0.9" />
    </svg>
));
