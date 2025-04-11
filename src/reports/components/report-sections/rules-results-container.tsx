// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import styles from './rules-results-container.scss';

export type RulesResultsContainerProps = Pick<
    CombinedReportSectionProps,
    'getCollapsibleScript' | 'getCopyToClipboardScript'
>;

export const RulesResultsContainer = NamedFC<RulesResultsContainerProps>(
    'RulesResultsContainer',
    ({ children, getCollapsibleScript, getCopyToClipboardScript }) => {
        return (
            <>
                <div className={styles.rulesResultsContainer}>
                    <div className={styles.resultsHeading}>
                        <h2>Rules</h2>
                    </div>
                    {children}
                </div>
                <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
                <script dangerouslySetInnerHTML={{ __html: getCopyToClipboardScript() }} />
            </>
        );
    },
);
