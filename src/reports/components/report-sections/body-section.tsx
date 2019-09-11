// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

export const BodySection = NamedFC('BodySection', ({ children }) => {
    return <body>{children}</body>;
});
