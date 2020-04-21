// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { productName } from 'content/strings/application';
import { BrandWhite } from 'icons/brand/white/brand-white';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import * as styles from './header-section.scss';

export interface HeaderSectionProps {
    targetAppInfo: TargetAppData;
}

export const HeaderSection = NamedFC<HeaderSectionProps>('HeaderSection', ({ targetAppInfo }) => {
    return (
        <header>
            <div className={styles.reportHeaderBar}>
                <BrandWhite />
                <div className={styles.headerText}>{productName}</div>
            </div>
            <div className={styles.reportHeaderCommandBar}>
                <div className={styles.targetPage}>
                    Target page:&nbsp;
                    <NewTabLinkWithConfirmationDialog
                        href={targetAppInfo.url}
                        title={targetAppInfo.name}
                    >
                        {targetAppInfo.name}
                    </NewTabLinkWithConfirmationDialog>
                </div>
            </div>
        </header>
    );
});
