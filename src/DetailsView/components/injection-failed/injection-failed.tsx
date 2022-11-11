// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import styles from './injection-failed.scss';

export const InjectionFailed = NamedFC('InjectionFailed', () => {
    return (
        <main className={styles.injectionFailed}>
            <h1>Unable to communicate with target page</h1>
            <ul>
                <li>
                    If you are using Edge, make sure that the target page is not in Internet
                    Explorer mode.
                </li>
            </ul>
        </main>
    );
});
