// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { HeaderBar } from 'reports/components/header-bar';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import styles from './header-section.scss';

export const reportHeaderSectionDataAutomationId: string = 'report-header-section';
export interface HeaderSectionProps {
    targetAppInfo: TargetAppData;
    headerText: string;
}

export const HeaderSection = NamedFC<HeaderSectionProps>(
    'HeaderSection',
    ({ targetAppInfo, headerText }) => {
        return (
            <header data-automation-id={reportHeaderSectionDataAutomationId}>
                <HeaderBar headerText={headerText} />
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
    },
);
