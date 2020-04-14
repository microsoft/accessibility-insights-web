// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { androidAppTitle } from 'content/strings/application';
import { BrandWhite } from 'icons/brand/white/brand-white';
import * as React from 'react';
import * as styles from 'reports/components/report-sections/header-section.scss';

export const UnifiedHeaderSection = NamedFC('UnifiedHeaderSection', () => {
    return (
        <header>
            <div className={styles.reportHeaderBar}>
                <BrandWhite />
                <div className={styles.headerText}>{androidAppTitle}</div>
            </div>
        </header>
    );
});
