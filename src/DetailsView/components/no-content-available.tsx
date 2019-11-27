// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import { productName } from 'content/strings/application';
import * as React from 'react';

import { targetPageClosed } from './target-page-closed-view.scss';

export const NoContentAvailable = NamedFC('NoContentAvailable', () => {
    return (
        <main className={targetPageClosed}>
            <h1>No content available</h1>
            <ul>
                <li>If the target page was closed, you can close this tab or reuse it for something else.</li>
                <li>
                    If the URL was change on the target page, you can reactivate this tab by pressing{' '}
                    <Markup.Term>{productName}</Markup.Term> extension icon on the browser toolbar or by using the extension shortcuts.
                </li>
            </ul>
        </main>
    );
});
