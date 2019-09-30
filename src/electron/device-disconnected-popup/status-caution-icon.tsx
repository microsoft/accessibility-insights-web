// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const StatusCautionIcon = NamedFC('StatusCautionIcon', () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 5.25C12.6213 5.25 13.125 5.75368 13.125 6.375V13.125C13.125 13.7463 12.6213 14.25 12 14.25C11.3787 14.25 10.875 13.7463 10.875 13.125V6.375C10.875 5.75368 11.3787 5.25 12 5.25ZM10.875 17.25C10.875 16.6287 11.3787 16.125 12 16.125C12.6213 16.125 13.125 16.6287 13.125 17.25C13.125 17.8713 12.6213 18.375 12 18.375C11.3787 18.375 10.875 17.8713 10.875 17.25Z"
            fill="#D67F3C"
        />
    </svg>
));
