// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export const CrossIcon = NamedFC('CrossIcon', () => (
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
            <circle cx="8" cy="8" r="8" fill="#E81123" />
            <path
                d="M10.9837 6.27639C11.3352 5.92491 11.3352 5.35507 10.9837 5.00359C10.6322 4.65212 10.0624 4.65212 9.7109 5.00359L7.99722 6.71728L6.28375 5.00381C5.93227 4.65234 5.36242 4.65234 5.01095 5.00381C4.65948 5.35528 4.65948 5.92513 5.01095 6.2766L6.72443 7.99007L4.9837 9.7308C4.63222 10.0823 4.63222 10.6521 4.9837 11.0036C5.33517 11.3551 5.90502 11.3551 6.25649 11.0036L7.99722 9.26287L9.73816 11.0038C10.0896 11.3553 10.6595 11.3553 11.011 11.0038C11.3624 10.6523 11.3624 10.0825 11.011 9.73101L9.27001 7.99007L10.9837 6.27639Z"
                fill="var(--neutral-0)"
            />
        </svg>
    </span>
));

export const CrossIconInverted = NamedFC('CrossIconInverted', () => (
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
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58173 12.4183 0 8 0C3.58172 0 0 3.58173 0 8C0 12.4183 3.58172 16 8 16ZM10.9947 4.99466C10.7018 4.70178 10.2269 4.70178 9.93401 4.99466L8 6.92868L6.06599 4.99466C5.77309 4.70178 5.29823 4.70178 5.00533 4.99466C4.71243 5.28757 4.71243 5.76242 5.00533 6.05533L6.93933 7.98932L4.99467 9.93399C4.70177 10.2269 4.70177 10.7018 4.99467 10.9947C5.28756 11.2876 5.76243 11.2876 6.05532 10.9947L8 9.04999L9.94467 10.9947C10.2376 11.2876 10.7124 11.2876 11.0053 10.9947C11.2982 10.7018 11.2982 10.2269 11.0053 9.93399L9.06066 7.98932L10.9947 6.05533C11.2876 5.76242 11.2876 5.28757 10.9947 4.99466Z"
                fill="var(--neutral-0)"
            />
        </svg>
    </span>
));
