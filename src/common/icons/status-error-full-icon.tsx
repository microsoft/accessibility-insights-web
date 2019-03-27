// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';

const d =
    'M9 0C9.82617 0 10.623 0.108398 11.3906 0.325195C12.1582 0.536133 12.873 0.837891 13.5352 1.23047C14.2031 1.62305 14.8096 2.09473 ' +
    '15.3545 2.64551C15.9053 3.19043 16.377 3.79688 16.7695 4.46484C17.1621 5.12695 17.4639 5.8418 17.6748 6.60938C17.8916 7.37695 18 ' +
    '8.17383 18 9C18 9.82617 17.8916 10.623 17.6748 11.3906C17.4639 12.1582 17.1621 12.876 16.7695 13.5439C16.377 14.2061 15.9053 ' +
    '14.8125 15.3545 15.3633C14.8096 15.9082 14.2031 16.377 13.5352 16.7695C12.873 17.1621 12.1582 17.4668 11.3906 17.6836C10.623 ' +
    '17.8945 9.82617 18 9 18C8.17383 18 7.37695 17.8945 6.60938 17.6836C5.8418 17.4668 5.12402 17.1621 4.45605 16.7695C3.79395 16.377 ' +
    '3.1875 15.9082 2.63672 15.3633C2.0918 14.8125 1.62305 14.2061 1.23047 13.5439C0.837891 12.876 0.533203 12.1582 0.316406 ' +
    '11.3906C0.105469 10.623 0 9.82617 0 9C0 8.17383 0.105469 7.37695 0.316406 6.60938C0.533203 5.8418 0.837891 5.12695 1.23047 ' +
    '4.46484C1.62305 3.79688 2.0918 3.19043 2.63672 2.64551C3.1875 2.09473 3.79395 1.62305 4.45605 1.23047C5.12402 0.837891 5.8418 ' +
    '0.536133 6.60938 0.325195C7.37695 0.108398 8.17383 0 9 0ZM9.99316 9L12.999 5.99414L12.0059 5.00098L9 8.00684L5.99414 ' +
    '5.00098L5.00098 5.99414L8.00684 9L5.00098 12.0059L5.99414 12.999L9 9.99316L12.0059 12.999L12.999 12.0059L9.99316 9Z';
export const StatusErrorFullIcon = NamedSFC('StatusErrorFullIcon', () => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d={d} fill="#E81123" />
    </svg>
));
