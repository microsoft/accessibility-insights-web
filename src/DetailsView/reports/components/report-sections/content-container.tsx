// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';

export const ContentContainer = NamedSFC('ContentSection', ({ children }) => {
    return <div className="content-section">{children}</div>;
});
