// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import { productName } from 'content/strings/application';
import * as React from 'react';

import styles from './no-content-available.scss';

export const NoContentAvailable = NamedFC('NoContentAvailable', () => {
    return (
        <main className={styles.noContentAvailable}>
            <h1>No content available</h1>
            <ul>
                <li>
                    If the target page was closed, you can close this tab or reuse it for something
                    else.
                </li>
                <li>
                    If the URL was changed on the target page, you can reactivate{' '}
                    <Markup.Term>{productName}</Markup.Term> by selecting the extension icon on the
                    browser toolbar or by using the extension keyboard shortcuts.
                </li>
            </ul>
        </main>
    );
});
