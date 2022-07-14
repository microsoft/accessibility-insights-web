// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export const CheckIcon = NamedFC('CheckIcon', () => (
    <span className="check-container">
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
        >
            <circle cx="8" cy="8" r="8" fill="#228722" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.05904 11.1417L6.0616 11.1442C6.10737 11.19 6.15668 11.23 6.20867 11.2643C6.57256 11.5046 7.06707 11.4646 7.38742 11.1442C7.38861 11.143 7.38982 11.1418 7.391 11.1406L11.9312 6.60041C12.2974 6.23427 12.2974 5.64071 11.9312 5.27457C11.5651 4.90848 10.9715 4.90848 10.6054 5.27457L6.72452 9.15545L5.60041 8.03134C5.2343 7.66524 4.64071 7.66524 4.27459 8.03134C3.90847 8.39747 3.90847 8.99104 4.27459 9.35718L6.05904 11.1417Z"
                fill="var(--neutral-0)"
            />
        </svg>
    </span>
));

export const CheckIconInverted = NamedFC('CheckIconInverted', () => (
    <span className="check-container">
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.0616 11.1442L6.05904 11.1417L4.27459 9.35718C3.90847 8.99104 3.90847 8.39747 4.27459 8.03134C4.64071 7.66524 5.2343 7.66524 5.60041 8.03134L6.72452 9.15545L10.6054 5.27457C10.9715 4.90848 11.5651 4.90848 11.9312 5.27457C12.2974 5.64071 12.2974 6.23427 11.9312 6.60041L7.391 11.1406L7.38742 11.1442C7.06707 11.4646 6.57256 11.5046 6.20867 11.2643C6.15668 11.23 6.10737 11.19 6.0616 11.1442Z"
                fill="white"
            />
        </svg>
    </span>
));
