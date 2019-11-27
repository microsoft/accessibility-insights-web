// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { targetPageClosed } from './target-page-closed-view.scss';

export const NoContentAvailable = NamedFC('NoContentAvailable', () => {
    return (
        <main className={targetPageClosed}>
            <h1>No content available</h1>
            <p>The target page was closed. You can close this tab or reuse it for something else.</p>
        </main>
    );
});
