// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './header-section.scss';

export const HeaderSection = NamedFC('HeaderSection', () => {
    return (
        <div className={styles.headerSection}>
            <h1 className={styles.title}>Automated checks</h1>
            <p className={styles.subtitle}>
                Automated checks can detect some common accessibility problems such as missing or invalid properties. But most accessibility
                problems can only be discovered through manual testing.
            </p>
        </div>
    );
});
