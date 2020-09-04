// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import * as styles from './header-section.scss';
import { HeaderBar } from 'reports/components/header-bar';
import { productName } from 'content/strings/application';

export interface HeaderSectionProps {
    targetAppInfo: TargetAppData;
}

export const HeaderSection = NamedFC<HeaderSectionProps>('HeaderSection', ({ targetAppInfo }) => {
    return (
        <header>
            <HeaderBar headerText={productName} />
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
