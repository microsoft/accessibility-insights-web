// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

export const BodySection = NamedSFC('BodySection', ({ children }) => {
    return <body>{children}</body>;
});
