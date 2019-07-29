// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from 'common/react/named-sfc';

export const ContentContainer = NamedSFC('ContentSection', ({ children }) => {
    return (
        <main className="outer-container">
            <div className="content-container">{children}</div>
        </main>
    );
});
