// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

const d =
    'M8.82353 16C8.09697 16 7.39677 15.9062 6.72294 15.7188C6.05497 15.5312 5.42802 15.2676 4.84208 14.9277C4.26201 14.582 ' +
    '3.73173 14.1719 3.25126 13.6973C2.77665 13.2168 2.3665 12.6865 2.02079 12.1064C1.68095 11.5205 1.41728 10.8936 1.22978 ' +
    '10.2256C1.04228 9.55176 0.948529 8.85156 0.948529 8.125C0.948529 7.39844 1.04228 6.70117 1.22978 6.0332C1.41728 5.35937 ' +
    '1.68095 4.73242 2.02079 4.15234C2.3665 3.56641 2.77665 3.03613 3.25126 2.56152C3.73173 2.08105 4.26201 1.6709 4.84208 ' +
    '1.33105C5.42802 0.985352 6.05497 0.71875 6.72294 0.53125C7.39677 0.34375 8.09697 0.25 8.82353 0.25C9.55009 0.25 10.2474 ' +
    '0.34375 10.9153 0.53125C11.5892 0.71875 12.2161 0.985352 12.7962 1.33105C13.3821 1.6709 13.9124 2.08105 14.387 ' +
    '2.56152C14.8675 3.03613 15.2776 3.56641 15.6175 4.15234C15.9632 4.73242 16.2298 5.35937 16.4173 6.0332C16.6048 ' +
    '6.70117 16.6985 7.39844 16.6985 8.125C16.6985 8.85156 16.6048 9.55176 16.4173 10.2256C16.2298 10.8936 15.9632 11.5205 ' +
    '15.6175 12.1064C15.2776 12.6865 14.8675 13.2168 14.387 13.6973C13.9124 14.1719 13.3821 14.582 12.7962 14.9277C12.2161 15.2676 ' +
    '11.5892 15.5312 10.9153 15.7188C10.2474 15.9062 9.55009 16 8.82353 16ZM8.82353 1.375C7.89189 1.375 7.01591 1.55371 6.1956 ' +
    '1.91113C5.38115 2.2627 4.6663 2.74609 4.05107 3.36133C3.44169 3.9707 2.95829 4.68555 2.60087 5.50586C2.24931 6.32031 2.07353 ' +
    '7.19336 2.07353 8.125C2.07353 9.05664 2.24931 9.93262 2.60087 10.7529C2.95829 11.5674 3.44169 12.2822 4.05107 12.8975C4.6663 ' +
    '13.5068 5.38115 13.9902 6.1956 14.3477C7.01591 14.6992 7.89189 14.875 8.82353 14.875C9.75517 14.875 10.6282 14.6992 11.4427 ' +
    '14.3477C12.263 13.9902 12.9778 13.5068 13.5872 12.8975C14.2024 12.2822 14.6858 11.5674 15.0374 10.7529C15.3948 9.93262 ' +
    '15.5735 9.05664 15.5735 8.125C15.5735 7.19336 15.3948 6.32031 15.0374 5.50586C14.6858 4.68555 14.2024 3.9707 13.5872 ' +
    '3.36133C12.9778 2.74609 12.263 2.2627 11.4427 1.91113C10.6282 1.55371 9.75517 1.375 8.82353 1.375ZM8.82353 ' +
    '8.125V3.625H7.69853V9.25H12.1985V8.125H8.82353Z';

export const DateIcon = NamedFC('DateIcon', () => (
    <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
    >
        <path d={d} fill="#737373" />
    </svg>
));
