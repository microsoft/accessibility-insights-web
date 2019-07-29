// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

export const ContentContainer = NamedSFC('ContentSection', ({ children }) => {
    return (
        <main className="outer-container">
            <div className="content-container">{children}</div>
        </main>
    );
});
