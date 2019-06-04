// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export const BaseCardLayer = NamedSFC('BaseCardLayer', ({ children }) => {
    return <div className="base-card-layer-main">{children}</div>;
});
