// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const ContentContainer = NamedFC('ContentSection', ({ children }) => {
    return (
        <main className="outer-container">
            <div className="content-container">{children}</div>
        </main>
    );
});
